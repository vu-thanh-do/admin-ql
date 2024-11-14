import ListCategory from '../components/ListCategory/ListCategory'
import ListCategoryDeleted from '../components/ListCategoryDeleted/ListCategoryDeleted'

export const items = [
  { key: '1', label: 'Tất cả Tuyến đường', children: <ListCategory /> },
  { key: '2', label: 'Tuyến đường đã xóa', children: <ListCategoryDeleted /> }
]
