import { Button, Form, InputNumber, Modal, Select, notification } from "antd";
import { useState } from "react";
import { updateOrder } from "../../services/orderService";

function UpdateOrder({ item }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateOrder(item.id, values);
      api["success"]({
        message: "Cập nhật đơn hàng thành công!",
        duration: 1.5,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      api["error"]({
        message: "Cập nhật thất bại!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Button type="default" onClick={() => setIsModalOpen(true)}>
        Sửa
      </Button>
      <Modal
        title={`Cập nhật đơn hàng #${item.id}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            totalAmount: item.totalAmount,
            status: item.status,
          }}
        >
          <Form.Item
            label="Tổng tiền"
            name="totalAmount"
            rules={[{ required: true, message: "Nhập tổng tiền!" }]}
          >
            <InputNumber min={1000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Chọn trạng thái!" }]}
          >
            <Select
              options={[
                { label: "Đang xử lý", value: "UNPROCESSED" },
                { label: "Hoàn thành", value: "COMPLETED" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateOrder;