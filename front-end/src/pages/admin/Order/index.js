import { useEffect, useState } from "react";
import { Button, Divider, Flex, notification, Popconfirm, Radio, Table, Tag } from "antd";
import Cookies from "js-cookie";
import { getInfoUser } from "../../../services/userService";
import { getOrderByUserId, delOrder } from "../../../services/orderService";
import { useDispatch } from "react-redux";
import { setOrder, deleteOrder } from "../../../actions/order";
// import CreateOrder from "../../../components/Order/CreateOrder";
import UpdateOrder from "../../../components/Order/UpdateOrder";

const columns = [
  {
    title: "ID đơn hàng",
    dataIndex: "id",
    render: (text) => <b>{text}</b>,
  },
  {
    title: "Người dùng",
    dataIndex: "user",
  },
  {
    title: "Số lượng sản phẩm",
    dataIndex: "totalItems",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalAmount",
    render: (amount) => <span>{amount.toLocaleString()} ₫</span>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) =>
      status === "UNPROCESSED" ? (
        <Tag color="red">Đang xử lý</Tag>
      ) : (
        <Tag color="green">Hoàn thành</Tag>
      ),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
  },
  {
    title: "Hành động",
    dataIndex: "actions",
    width: 160,
    fixed: "right",
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log("selectedRows:", selectedRows);
  },
};

function Order() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const user = await getInfoUser(Cookies.get("userId"));
        if (user) {
          const response = await getOrderByUserId(user.id);
          if (response && response.content) {
            const dataTable = response.content.map((item, index) => {
              const date = new Date(item.createdAt).toLocaleDateString();
              const totalItems =
                item.orderItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;

              return {
                key: index + 1,
                id: item.id,
                user: `${item.userInfo.id} - ${item.userInfo.fullName}`,
                totalItems,
                totalAmount: item.totalAmount,
                status: item.status,
                createdAt: date,
                actions: (
                  <>
                    <UpdateOrder item={item} />
                    <Popconfirm
                      title="Xóa đơn hàng"
                      description="Bạn có chắc muốn xóa đơn hàng này?"
                      okText="Đồng ý"
                      cancelText="Hủy"
                      onConfirm={() => handleDelete(item.id)}
                    >
                      <Button type="primary" danger>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </>
                ),
              };
            });
            setData(dataTable);
            dispatch(setOrder(response.content)); 
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };
    fetchApi();
  }, [dispatch]);

  const handleDelete = async (id) => {
    await delOrder(id);
    dispatch(deleteOrder(id));
    setData((prev) => prev.filter((item) => item.id !== id)); 
    api["success"]({
      message: `Xóa đơn hàng thành công!`,
      duration: 1.5,
    });
  };

  return (
    <>
      {contextHolder}
      <h1>Quản lý đơn hàng</h1>
      <Flex justify="space-between" align="center">
        <Radio.Group
          onChange={(e) => setSelectionType(e.target.value)}
          value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">Radio</Radio>
        </Radio.Group>
        {/* <CreateOrder /> */}
      </Flex>
      <Divider />
      <Table
        rowSelection={Object.assign({ type: selectionType }, rowSelection)}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </>
  );
}

export default Order;