import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, message } from 'antd'
import { ICategory, IImage, IProduct, ISize, ITopping } from '~/types'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setProductId } from '~/store/slices'
import {
  useCreateProductMutation,
  useEditProductMutation,
  useGetAllCategoryQuery,
  useGetAllSizeDefaultQuery,
  useGetAllToppingsQuery
} from '~/store/services'
import { useEffect, useState } from 'react'

import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Loader } from '~/common'
import { Loading } from '~/components'
import { handleUploadImage } from '../..'
import { useAppSelector } from '~/store/hooks'

const { Option } = Select

const FormProduct = () => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { product } = useAppSelector((state: RootState) => state.products)
  const [infoPage, _] = useState({
    _page: 1,
    _limit: 10
  })
  const [categories, setCategories] = useState<ICategory[]>([])
  const [sizeDefault, setSizeDefault] = useState<ISize[]>([])
  const [toppings, setToppings] = useState<ITopping[]>([])
  const [isUpload, setIsUpload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<IImage[]>([])
  const [productEdit, setProductEdit] = useState<IProduct | null>(null)

  const { productId } = useAppSelector((state) => state.products)
  const { data: dataCategories } = useGetAllCategoryQuery({ ...infoPage })
  const { data: dataToppings } = useGetAllToppingsQuery({ ...infoPage })
  const { data: dataSizeDefault } = useGetAllSizeDefaultQuery()
  const [createProduct, { isLoading: isCreateLoading }] = useCreateProductMutation()
  const { productsList } = useAppSelector((state: RootState) => state.products)
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation()
  console.log(productsList, 'productsListproductsList')
  useEffect(() => {
    if (dataCategories && dataToppings && dataSizeDefault) {
      setCategories(dataCategories?.docs)
      setToppings(dataToppings?.data)
      setSizeDefault(dataSizeDefault?.data)
    }
  }, [dataCategories, dataToppings, dataSizeDefault])

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = await handleUploadImage(e, setIsLoading)
    setIsUpload(true)
    setImages(urls as IImage[])
  }

  const handleSubmitForm = async (values: any) => {
    console.log(values, 'cccc')

    if (productId && productEdit) {
      const data = {
        ...values
      }
      try {
        const response = await editProduct({ id: productEdit._id, product: data }).unwrap()
        if (response.message === 'success') {
          message.success('Cập nhật Xe thành công!')
        }
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
        setIsUpload(false)
        /* reset form */
        form.resetFields()
        setImages([])
      } catch (error) {
        message.error('Có lỗi xảy ra, vui lòng thử lại sau!')
      }
      return
    }

    try {
      const response = await createProduct({ ...values }).unwrap()
      if (response.message === 'success' || response.message === 'succes') {
        message.success('Thêm Xe thành công!')
      }
      dispatch(setOpenDrawer(false))
      dispatch(setProductId(null))
      setIsUpload(false)
      /* reset form */
      form.resetFields()
      setImages([])
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }

  /* edit product */
  useEffect(() => {
    if (productEdit) {
      form.setFieldsValue({
        busTypeName: productEdit.busTypeName,
        seatCapacity: productEdit.seatCapacity,
        priceFactor: productEdit.priceFactor,
        licensePlate: productEdit.licensePlate
      })
    }
  }, [
    form,
    productEdit,
    productsList.busTypeName,
    productsList.licensePlate,
    productsList.priceFactor,
    productsList.seatCapacity
  ])
  console.log('🚀 ~ file: FormProduct.tsx:130 ~ useEffect ~ productEdit.sizes:', productEdit)

  useEffect(() => {
    if (productId) {
      const product = productsList?.data?.find((product) => product._id === productId)

      if (product) setProductEdit(product)
    } else {
      setProductEdit(null)
    }
  }, [productId, productsList])

  return (
    <Drawer
      title={`${productId === null ? 'Thêm' : 'Cập nhật'} Xe`}
      placement='right'
      width={850}
      destroyOnClose
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
      }}
      open={product ? false : openDrawer}
      extra={
        <Space>
          <label
            htmlFor='button-submit-form'
            onClick={() => {}}
            className='bg-primary py-2 px-4 flex justify-center items-center h-[44px] text-white rounded-lg cursor-pointer'
          >
            {!isCreateLoading && <p>{productId === null ? 'Thêm' : 'Cập nhật'} </p>}
            {isCreateLoading && (
              <div className='border-t-primary animate-spin w-6 h-6 border-2 border-t-2 border-white rounded-full'></div>
            )}
          </label>
        </Space>
      }
    >
      {(isCreateLoading || isUpdating) && <Loading overlay />}
      <Form layout='vertical' autoComplete='off' form={form} onFinish={handleSubmitForm}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='busTypeName'
              label='Loại Xe'
              rules={[
                { required: true, message: 'Loại Xe là bắt buộc!' },
                {
                  validator: (_, value) => {
                    if (value.trim() === '') {
                      return Promise.reject('Loại Xe không được chứa toàn khoảng trắng!')
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input placeholder='Loại Xe' size='large' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='seatCapacity'
              label='Số ghế'
              rules={[
                { required: true, message: 'Không được bỏ trống!' },
                {
                  type: 'number',
                  min: 1,
                  message: 'Số ghế phải là số lớn hơn 0!'
                }
              ]}
            >
              {/* <InputNumber
                placeholder='Số ghế Xe'
                className='w-full'
                min={1} // Đảm bảo giá trị tối thiểu là 1
                parser={(value) => value?.replace(/[^\d]/g, '')}
              /> */}
             <Select>
                <Select.Option value={16}>16</Select.Option>
                <Select.Option value={24}>24</Select.Option>
                <Select.Option value={36}>36</Select.Option>
              </Select>

            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='priceFactor'
              label='Hệ Số giá'
              rules={[
                { required: true, message: 'Hệ Số giá Không được bỏ trống!' },
                {
                  type: 'number',
                  min: 1,
                  message: 'Hệ Số giá phải là số lớn hơn 0!'
                }
              ]}
            >
              {/* <InputNumber
                placeholder='Hệ Số giá Xe'
                className='w-full'
                min={1} // Đảm bảo giá trị tối thiểu là 1
                parser={(value) => value?.replace(/[^\d]/g, '')}
              /> */}
              <Select>
                <Select.Option value={1}>1.0</Select.Option>
                <Select.Option value={1.2}>1.2</Select.Option>
                <Select.Option value={1.5}>1.5</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='licensePlate'
              label='Biển Số Xe'
              rules={[
                { required: true, message: 'Không được bỏ trống!' },
                {
                  pattern: /^[0-9]{2}[A-Z]{1,2}-\d{3,5}(\.\d{2})?$/,
                  message: 'Biển số xe không đúng định dạng!  định dạng đúng (VD: 30A-12345 hoặc 29C-567.89)'
                },
                {
                  validator: (_, value) => {
                    if (value) {
                      const provinceCode = parseInt(value.slice(0, 2), 10)
                      if (provinceCode < 1 || provinceCode > 99) {
                        return Promise.reject('Mã tỉnh phải từ 01 đến 99!')
                      }
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input placeholder='Biển Số  Xe' className='w-full' />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={24}>
            {!isUpload && !isLoading && (
              <Form.Item
                name='images'
                className='w-full'
                label='Hình ảnh Xe'
                rules={[{ required: productEdit ? false : true, message: 'Không được để trống hình ảnh Xe' }]}
              >
                <input type='file' onChange={(e) => handleOnChange(e)} id='thumbnail' multiple className='!hidden' />
                <label
                  htmlFor='thumbnail'
                  className='rounded-xl flex-col flex items-center justify-center h-[150px] w-full gap-3 p-5 border border-gray-400 border-dashed'
                >
                  <p className='mx-auto text-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6 mx-auto'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z'
                      />
                    </svg>
                  </p>
                  <p className='ant-upload-text text-center'>Tải hình ảnh</p>
                </label>
              </Form.Item>
            )}
            {isLoading && !isUpload && (
              <div className='rounded-xl flex-col flex items-center justify-center h-[150px] w-full gap-3 p-5 border border-gray-400 border-dashed'>
                <Loader className='bg-transparent' />
              </div>
            )}
            {isUpload && !isLoading && (
              <div className='rounded-xl flex-wrap items-center justify-center flex h-[150px] w-full gap-3 p-5 border border-gray-300 relative'>
                {images &&
                  images.length > 0 &&
                  images.map((image) => (
                    <div className='' key={image.publicId}>
                      <div className='h-[80px] w-[80px] object-cover rounded-md'>
                        <img src={image.url} alt='' className='object-cover w-full h-full border rounded-md shadow' />
                      </div>
                      <div
                        className='top-4 left-4 absolute flex items-center justify-center w-4 h-4 cursor-pointer'
                        onClick={() => setIsUpload(false)}
                      >
                        <AiOutlineCloseCircle />
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {productEdit && (
              <div className='rounded-xl flex-col items-start justify-start flex h-[150px] w-full gap-3 relative'>
                <p className='text-left'>Hoặc giữ lại ảnh cũ</p>
                {productEdit.images.map((image) => (
                  <div className='h-[80px] w-[80px] object-cover rounded-md' key={image.publicId}>
                    <img
                      src={image.url}
                      key={image.publicId}
                      alt={image.filename}
                      className='object-cover w-full h-full border rounded-md shadow'
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='description'
              label='Nhập tuyến đường'
              rules={[
                {
                  required: true,
                  message: 'tuyến đường là bắt buộc'
                }
              ]}
            >
              <Input.TextArea rows={4} placeholder='tuyến đường' />
            </Form.Item>
          </Col>
        </Row> */}

        <input type='submit' id='button-submit-form' value={'gửi'} className='hidden' />
      </Form>
    </Drawer>
  )
}

export default FormProduct
