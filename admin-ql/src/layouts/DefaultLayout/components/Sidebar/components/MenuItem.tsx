import { BarChartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineControl, AiOutlineFontSize } from 'react-icons/ai'
import { BiCategoryAlt, BiSolidCategoryAlt } from 'react-icons/bi'
import { FaClipboardList, FaImages, FaRegNewspaper, FaUserEdit, FaUserFriends } from 'react-icons/fa'
import type { MenuProps } from 'antd'
import { HiCollection } from 'react-icons/hi'
import { IoTicket } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
type MenuItem = Required<MenuProps>['items'][number]
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}
export const items: MenuProps['items'] = [
  // giao diên chính
  getItem(<NavLink to={`/manager/orders`}>Quản lý vé</NavLink>, 'orders', <img className='w-[30px] bg-white' src='/ticket.png'/>),

  // quản lý đơn hàng

  // quản lý sản phẩm
  getItem('Quản lý', 'manager', <AiOutlineControl />, [
    getItem(<NavLink to={`/manager/products`}> Xe</NavLink>, 'products', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Tuyến đường</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/trips`}> Chuyến xe </NavLink>, 'trips', <HiCollection />),
    // getItem(<NavLink to={`/manager/sizes`}>Ghế xe</NavLink>, 'sizes', <AiOutlineFontSize />),
    getItem(<NavLink to={`/manager/vouchers`}>Mã giảm giá</NavLink>, 'vouchers', <IoTicket />)
  ]),
  // quản lý người dùng
  getItem('Người dùng', 'users', <UserOutlined />, [
    getItem(<NavLink to={`/manager/customers`}>Người dùng</NavLink>, 'customers', <FaUserFriends />),
  ])
]
export const itemsStaff: MenuProps['items'] = [
  getItem(<NavLink to={`/manager/orders`}>Quản lý vé</NavLink>, 'orders', <img className='w-[30px] bg-white' src='/ticket.png'/>),
  getItem('Quản lý', 'manager', <AiOutlineControl />, [
    getItem(<NavLink to={`/manager/products`}> Xe</NavLink>, 'products', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Tuyến đường</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/trips`}> Chuyến xe </NavLink>, 'trips', <HiCollection />),
    getItem(<NavLink to={`/manager/vouchers`}>Mã giảm giá</NavLink>, 'vouchers', <IoTicket />)
  ]),
  getItem('Người dùng', 'users', <UserOutlined />, [
    getItem(<NavLink to={`/manager/customers`}>Người dùng</NavLink>, 'customers', <FaUserFriends />),
  ])
]
