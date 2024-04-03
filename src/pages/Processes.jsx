import { useState } from 'react';
import { Table, Button, Modal } from '@douyinfe/semi-ui'
import axios from 'axios';
import { useEffect } from 'react';
import { IconSearch } from '@douyinfe/semi-icons';

export function Processes(props) {
    const [processes, setProcesses] = useState([]);
    const [pages, setPages] = useState({})
    const [regVisible, setRegVisible] = useState(false);
    const [pageVisible, setPageVisible] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [pageData, setPageData] = useState([]);
    useEffect(() => {
        axios.get('/api/info').then(resp => {
            console.log(resp.data);
            setProcesses(resp.data.pcbList);
            setPages(resp.data.pages)
        })
    }, [props.tick])
    const columns = [
        {
            title: '任务名称',
            dataIndex: 'ProcessName',
        },
        {
            title: 'PCBID',
            dataIndex: 'PCBID',
        },
        {
            title: '目前状态',
            dataIndex: 'ProcessState',
        },
        {
            title: '优先级',
            dataIndex: 'Priority',
        },
        {
            title: '寄存器详情',
            render: (_, record) => {
                return <Button icon={<IconSearch />} onClick={() => {
                    console.log(record)
                    setRegisters(record.RegisterCache.map((item, index) => {
                        let regName = "";
                        if(index == 0) {
                            regName = "CR"
                        } else if(index == 1) {
                            regName = "SP"
                        } else {
                            regName = `R${index - 1}`
                        }
                        return {
                            regName,
                            regValue: item
                        }
                    }))
                    setRegVisible(true);
                }} />
            },
        },
        {
            title: '页表详情',
            render: (_, record) => {
                return <Button icon={<IconSearch />} onClick={() => {
                    console.log(record)
                    const pageRaw = pages[String(record.PCBID)]
                    console.log(pageRaw)
                    const page = []
                    for(const key in pageRaw) {
                        page.push({
                            VirPage: key,
                            PhyPage: pageRaw[key].PhyPage,
                            Valid: String(pageRaw[key].Valid)
                        })
                    }
                    setPageData(page);
                    setPageVisible(true);
                }} />
            },
        },
    ];
    const columnsRegister = [
        {
            title: '寄存器名',
            dataIndex: 'regName',
        },
        {
            title: '寄存器值',
            dataIndex: 'regValue',
        }
    ]
    const columnsPage = [
        {
            title: '虚拟页号',
            dataIndex: 'VirPage',
        },
        {
            title: '物理页号',
            dataIndex: 'PhyPage',
        },
        {
            title: '是否在内存中',
            dataIndex: 'Valid',
        }
    ]
    return (
        <>
            <Table columns={columns} dataSource={processes} pagination={false} />
            <Modal title="寄存器详情" visible={regVisible} onCancel={() => { setRegVisible(false) }}>
                <Table columns={columnsRegister} dataSource={registers} pagination={true} />
            </Modal>
            <Modal title="内存详情" visible={pageVisible} onCancel={() => { setPageVisible(false) }}>
                <Table columns={columnsPage} dataSource={pageData} pagination={true} />
            </Modal>
        </>
        
    )
}