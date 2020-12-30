import { Form, Input, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { RouteChildrenProps, useParams, useHistory } from "react-router-dom";


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

        fetch(`http://localhost:3000/api/category/tree`, requestOptions)
            .then(async (res) => {
                const data = await handleResponse(res);
                debugger
                const categoryList = data.data.rows;

                setCategoryTree(categoryList)
            });
    })

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
        // try {
        //   setApp({ loading: true });
        //   if (record.id) {
        //     await studentService.UPDATE(record.id, values);
        //     message.success("Record updated");
        //   } else {
        //     const {
        //       data: { id },
        //     } = await studentService.CREATE(values);
        //     message.success("Record added");
        //     history.push(`/student/edit/${id}`);
        //   }
        // } catch (err) {
        //   console.error(err.message);
        //   message.error("Error while saving the record. Try again, later.");
        // } finally {
        //   setApp({ loading: false });
        // }
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
                    <Input />
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
