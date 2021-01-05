import { Col, Row, Select, Divider } from 'antd'
import Table from 'antd/es/table';
import React, { Component } from 'react'
const { Option } = Select;

class CourseList extends Component {
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
            method: "POST",
            headers: { "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token') }
          };
        
        fetch(`http://localhost:3000/api/courses`, requestOptions)
        .then(async(res) => {
            const data = await this.handleResponse(res);
            const listCourses = data.data.array;
            this.setState({
                data : listCourses
            })
        });
    }
    render() {
        const columns = [
            {
              title: 'Code',
              dataIndex: 'code',
              key: 'code',
              render: (text:any) => <a>{text}</a>,
            },
            {
              title: 'Teacher',
              dataIndex: 'owner_name',
              key: 'owner_name',
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Fee',
              dataIndex: 'fee',
              key: 'fee',
            },
            {
              title: 'Action',
              key: 'action',
              render: (text : any, record: any) => (
                <span>
                  <a>Delete</a>
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

export default CourseList;