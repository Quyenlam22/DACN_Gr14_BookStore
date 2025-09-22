import { useEffect, useState } from "react";
import { getOrderByUserId } from "../../../services/orderService";
import Cookies from 'js-cookie';
import { getInfoUser } from "../../../services/userService";
import { Button, Table } from "antd";
import "./Order.scss";

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
  },
  {
    title: 'Thông tin khách hàng',
    dataIndex: 'userInfo',
  },
  {
    title: 'Sản phẩm đã đặt',
    dataIndex: 'orderItems',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalAmount',
  },
  {
    title: 'Trạng thái xử lý',
    dataIndex: 'status',
  },
  {
    title: 'Thời gian tạo',
    dataIndex: 'createdAt',
  },
];

// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
// };

function OrderList () {
  const [data, setData] = useState([]);

  useEffect(()=> {
    const fetchApi = async () => {
      const user = await getInfoUser(Cookies.get('userId'));
      if(user) {
        const response = await getOrderByUserId(user.id);
        if(response) {
          const dataTable = response.content.map((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            return {
              key: index + 1,
              id: item.id,
              userInfo: (
                <>
                  <p>{item.userInfo.fullName}</p>
                  <p>{item.userInfo.phone}</p>
                  <p>{item.userInfo.address}</p>
                </>
              ),
              orderItems: (
                item.orderItems.map((itemOrder) => (
                  <div className="item-order" key={itemOrder.id}>
                    <h3>{itemOrder.bookTitle}</h3>
                    <p>Số lượng: {itemOrder.quantity}</p>
                    <p>Giá: {(itemOrder.unitPrice * (1 - itemOrder.discount/100)).toFixed(2)}</p>
                    {/* <p>Giảm giá: {itemOrder.discount}</p> */}
                  </div>
                ))
              ),
              totalAmount: item.totalAmount,
              status: item.status === "UNPROCESSED" ? (
                <>
                  <Button type="primary" danger>Đang xử lý</Button>
                </>
              ) : (
                <>
                  <Button type="primary" style={{background: 'green'}}>Đã hoàn thành</Button>
                </>
              ),
              createdAt: date,
            }
          })
          setData(dataTable);
        }
      }
    }
    fetchApi();
  }, [])
  
  return (
    <>
      <Table
          columns={columns}
          dataSource={data}
          pagination={{pageSize: 5}}
          scroll={{x: 'max-content'}}
      />
    </>
  )
}

export default OrderList;