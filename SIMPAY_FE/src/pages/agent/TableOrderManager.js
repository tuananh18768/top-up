import { Button, Input, Modal, Space, Table } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import style from './agent.module.css'
import { dispatchAllOrder, fetchAllOrder } from '../../redux/actions/agentAction';
import TextArea from 'antd/lib/input/TextArea';
const { Column } = Table;
const TableOrderManager = ({ loading }) => {
    const { tokenAgent } = useSelector(state => state.token)
    const { AllOrder } = useSelector(state => state.agent)
    const dispatch = useDispatch()
    const agentLogin = localStorage.getItem('agent')
    useEffect(() => {
        if (agentLogin) {
            return fetchAllOrder(tokenAgent).then(res => dispatch(dispatchAllOrder(res)))
        }
        return
    }, [dispatch, tokenAgent, agentLogin, loading])




    const datas = AllOrder.map((current, index) => {
        return {
            key: index + 1,
            orderID: current.id,
            fullName: current.customerFirstName + current.customerLastName,
            phoneNumber: current.phoneNumber,
            locality: current.locallity,
            description: current.description,
            // products: current.products[0].product.brand,
            deliveryReceived: current.deliveryReceived,
            // costToShiper: '200$',
            // totalValue: "2342",
            address: current.address,
            dateCreated: current.createdAt,
            status: current.status,
        }
    })

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'Order ID',
            width: 140,
            dataIndex: 'orderID',
            key: 'orderID',
            fixed: 'left',
        },
        {
            title: 'Full Name',
            width: 200,
            dataIndex: 'fullName',
            key: 'fullName',
            fixed: 'left',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 180,
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
        },
        {
            title: 'Locality',
            dataIndex: 'locality',
            key: 'locality',
            width: 100,
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            width: 100,
        },
        {
            title: 'DeliveryReceived',
            dataIndex: 'deliveryReceived',
            key: 'deliveryReceived',
            width: 160,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 120,
            filters: [
                {
                  text: 'Hà Nội',
                  value: 'hanoi',
                },
                {
                  text: 'Đà Nẵng',
                  value: 'danang',
                },
              ],
              onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Total Value',
            dataIndex: 'totalValue',
            key: 'totalValue',
            width: 140,
        },
        {
            title: 'Agent',
            dataIndex: 'agent',
            key: 'agent',
            width: 100,
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            width: 150,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (record, index) => {
                return <Space size="middle">
                    <Button >
                    <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Modal title="Are you sure about Lock Agent? Enter the reason"
                    >
                        <h6>Reason</h6>
                        <TextArea rows={4} />
                    </Modal>
                    <Button >
                    <i class="fa-solid fa-eye"></i>
                    </Button>
                    <Button >
                    <i className="fa-solid fa-trash"></i>
                    </Button>
                </Space>
            }
        }

    ];


    return (
        <>
            <Table style={{width: "100%"}}
                columns={columns}
                dataSource={datas}
                scroll={{
                    x: 1500,
                    y: 300,
                }}
            />

            <h4>Total: {datas.length}</h4>
        </>

    )
}
export default TableOrderManager;