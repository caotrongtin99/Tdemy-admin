import { Col, Row, Select, Divider, notification } from 'antd'
import Table from 'antd/es/table';
import React, { Component } from 'react'
const { Option } = Select;

class CategoryList extends Component {
    state = {
        data: [],
    };
    handleResponse(response: any) {
        debugger
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
        
        fetch(`http://localhost:3000/api/category`, requestOptions)
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
    
      fetch(`http://localhost:3000/api/category/${record.name}`, requestOptions)
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
    render() {
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text:any) => <a>{text}</a>,
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