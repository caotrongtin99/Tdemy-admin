import { Select, notification, Image } from 'antd'
import Table from 'antd/es/table';
import Tag from 'antd/es/tag';
import React, { Component } from 'react'
const { Option } = Select;
require('dotenv').config()
const {REACT_APP_API_URL} = process.env;

class StudentList extends Component {
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
          debugger
        
        fetch(`${REACT_APP_API_URL}/api/users`, requestOptions)
        .then(async(res) => {
            const data = await this.handleResponse(res);
            const listUsers = data.data.rows;
            
            this.setState({
                data : listUsers
            })
        });
    }

    handleDeleteUser = (user:any) => {
        const requestOptions : any = {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token') }
          };
        
        fetch(`${REACT_APP_API_URL}/api/users/${user.id}`, requestOptions)
        .then(async(res) => {
            debugger
            const data = await this.handleResponse(res);
            if (data.result === 0) {
                const newDataSourse = this.state.data.filter((item:any) => item.id !== user.id)
                this.setState({
                    data : newDataSourse
                })
                notification.success({
                  message: 'Success!',
                  description: 'Delete User Successfully!'
                })
            } else {
                notification.error({
                    message: 'Error!'
                })
            }
        
        });
    }
    render() {
        console.log("==========", process.env)
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text:any) => <a>{text}</a>,
            },
            {
              title: 'Image',
              dataIndex: 'avatar_url',
              key: 'avatar_url',
              render: (text:any, record:any) => <Image
              width={100}
              src={record.avatar_url}
            />,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Role',
              dataIndex: 'role',
              key: 'role',
              render: (text: any, record: any) => {
                return(
                <Tag color={ record.role === 0 ? 'red' : record.role === 1 ? 'blue' : 'yellow' }>{record.role === 0 ? 'Student' : record.role === 1 ? 'Teacher' : 'Admin'}</Tag>
                )
              }
            },
            {
              title: 'Action',
              key: 'action',
              render: (text : any, record: any) => {
                return (<div>
                { record.role !== 2 &&
                  <span>
                    <a onClick={() => this.handleDeleteUser(record)}>Delete</a>
                  </span>
                }
                </div>)
              },
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

export default StudentList;