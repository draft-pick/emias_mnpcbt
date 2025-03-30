import { Pagination } from "antd";

export default function CustomPagination({ total = 10, pageSize = 10, ...props }) {
  return <Pagination total={total} pageSize={pageSize} {...props} />;
}