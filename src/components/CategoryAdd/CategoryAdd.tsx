import { Form, Input, Button, Card, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { RouteChildrenProps, useParams, useHistory } from "react-router-dom";
require('dotenv').config()
const {REACT_APP_API_URL} = process.env;
const { Option } = Select;

export const CategoryAdd: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const [categoryTree, setCategoryTree] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const requestOptions: any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem('token'),
                "x-refresh-token": localStorage.getItem('ref_token')
            }
        };

        fetch(`${REACT_APP_API_URL}/api/category/tree`, requestOptions)
            .then(async (res) => {
                const data = await handleResponse(res);
                debugger
                const categoryList = data.data.rows;

                setCategoryTree(categoryList)
            });
    }, [])

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

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };


    const handleSubmit = async (values: any) => {
        debugger
        const category = {
          ...values
        };
        if (!category.path) {
            Object.assign(category, { path: null })
        }
        const requestOptions:any = {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token')  
          },
          body: JSON.stringify(category),
        };
        return fetch(`${REACT_APP_API_URL}/api/category/`, requestOptions).then(async(data) => {
          const res = await handleResponse(data);
          if (res.status === "success") {
            notification.success({message: 'Create Category Successfully!'})
            form.resetFields();
            const requestOptions: any = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem('token'),
                    "x-refresh-token": localStorage.getItem('ref_token')
                }
            };
    
            fetch(`${REACT_APP_API_URL}/api/category/tree`, requestOptions)
                .then(async (res) => {
                    const data = await handleResponse(res);
                    debugger
                    const categoryList = data.data.rows;
    
                    setCategoryTree(categoryList)
                });
          } else {
            notification.error({ message: 'Something was wrong!'})
          }
        });
      };
    return (
        <Card
            type="inner"
            title="Add Category"
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
                    label="Root"
                    name="path"
                >
                    <Select placeholder="Please select a parent category" allowClear>
                        {
                            categoryTree.map((category:any) => <Option value={category.name}>{category.name}</Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    wrapperCol={{ flex: "auto" }}
                    style={{ textAlign: "center" }}
                >
                    <Button htmlType="submit" type="primary">
                        Add Category
          </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
