import { Col, Row, Select, Divider, notification, Typography } from 'antd'
import Table from 'antd/es/table';
import React, { Component } from 'react'
const { Option } = Select;
const { Text } = Typography;
require('dotenv').config()
const {REACT_APP_API_URL} = process.env;
class CategoryList extends Component {
    state = {
        data: [],
    };
    handleResponse(response: any) {
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
    componentDidMount = () => {
        const requestOptions : any = {
            method: "GET",
            headers: { "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token') }
          };
        
        fetch(`${REACT_APP_API_URL}/api/category`, requestOptions)
        .then(async(res) => {
            const data = await this.handleResponse(res);
            const listCategory = data.data.rows;
            this.setState({
                data : listCategory
            })
        });
    }

    deleteCategory = (record:any) => {
      const requestOptions:any = {
        method: "DELETE",
        headers: { "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token'),
        "x-refresh-token": localStorage.getItem('ref_token')
         }
      };
    
      fetch(`${REACT_APP_API_URL}/api/category/${record.name}`, requestOptions)
        .then(this.handleResponse)
        .then((res) => {
          if (res.status === "Can not delete category has been used!") {
            notification.error({
              message: 'Error!',
              description: 'Can not delete category has been used!'
            })
          } else {
            const newList = this.state.data.filter((category:any) => category.name !== record.name)
            this.setState({
              data: newList
            })
            notification.success({
              message: 'Successfully!',
              description: 'Delete category successfully!'
            })
          }
        });
    }

    onChangeCategory = (text:any, record: any) => {
      debugger
      let data;
      if (!record.path) {
        data = { name: text, path: null}
      } else {
        data = { name: text, path: record.path}
      }
      const requestOptions:any = {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token'),
        "x-refresh-token": localStorage.getItem('ref_token')
         },
         body: JSON.stringify(data)
      };
    
      fetch(`${REACT_APP_API_URL}/api/category/${record.name}`, requestOptions)
        .then(this.handleResponse)
        .then((res) => {
          if (res.data[0] === 1) {
            const requestOptions : any = {
              method: "GET",
              headers: { "Content-Type": "application/json",
              "x-access-token": localStorage.getItem('token'),
              "x-refresh-token": localStorage.getItem('ref_token') }
            };
          
            fetch(`${REACT_APP_API_URL}/api/category`, requestOptions)
            .then(async(res) => {
                const data = await this.handleResponse(res);
                const listCategory = data.data.rows;
                this.setState({
                    data : listCategory
                })
            });
            notification.success({ message: 'Success!'})
          } else {
            notification.error({
              message: 'Error!',
              description: 'Something was wrong!'
            })
          }
        });
    }
    render() {
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text:any, record:any) => <Text editable={{ onChange: (e) => this.onChangeCategory(e, record) }}>{text}</Text>,
            },
            {
              title: 'Parent',
              dataIndex: 'path',
              key: 'path',
            },
            {
              title: 'Action',
              key: 'action',
              render: (text : any, record: any) => (
                <span>
                  <a onClick={() => this.deleteCategory(record)}>Delete</a>
                </span>
              ),
            },
          ];
          
        const data = this.state.data;
        return (
            <>
               <Table 
                columns={columns} dataSource={data}
               />
            </>
        );
    }
}

export default CategoryList;