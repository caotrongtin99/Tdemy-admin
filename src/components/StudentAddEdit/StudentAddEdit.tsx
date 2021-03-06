import { Form, Input, Button, Card, message, notification } from "antd";
import { useEffect } from "react";
import { RouteChildrenProps, useParams, useHistory } from "react-router-dom";
require('dotenv').config()
const {REACT_APP_API_URL} = process.env;

export const StudentAddEdit: React.FC<RouteChildrenProps> = () => {
  const [form] = Form.useForm();
  const params = useParams<{ id: string }>();
  const history = useHistory();


  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const handleSubmit = async (values: any) => {
    const user = {
      ...values,
      role: 1
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    return fetch(`${REACT_APP_API_URL}/api/users/`, requestOptions).then(async(data) => {
      const res = await handleResponse(data);
      if (res.status === "success") {
        notification.success({message: 'Create Teacher Account Successfully!'})
      } else {
        notification.success({ message: 'Create Teacher Account Successfully!'})
      }
    });
  };

  const handleResponse = (response: any) => {
    return response.text().then((text: any) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if (response.status === 401) {
          window.location.reload(true);
        }
  
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
  
      return data;
    });
  }

  return (
    <Card
      type="inner"
      title="Add Teacher"
      className="full-inner-card-body"
    >
      <Form
        name="addEditStudent"
        form={form}
        onFinish={handleSubmit}
        {...layout}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input.Password  />
        </Form.Item>

        <Form.Item
          wrapperCol={{ flex: "auto" }}
          style={{ textAlign: "center" }}
        >
          <Button htmlType="submit" type="primary">
            Add Teacher
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
