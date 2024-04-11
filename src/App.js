import "./App.css";
import { Layout } from "@douyinfe/semi-ui";
import { Tabs, TabPane, Button, Notification, Modal, TextArea, Input } from "@douyinfe/semi-ui";
import { IconFile, IconGlobe, IconHelpCircle } from "@douyinfe/semi-icons";
import { Processes } from "./pages/Processes";
import { FileSystem } from "./pages/FileSystem";
import { useRef, useState } from 'react';
import axios from 'axios';

function App() {
  const { Header, Content } = Layout;
  const [tick, setTick] = useState(false);
  const [showSubmitTask, setShowSubmitTask] = useState(false);
  const script = useRef("")
  const processName = useRef("")
  return (
    <Layout style={{ height: "100%" }}>
      <Modal title="提交任务" visible={showSubmitTask} onCancel={() => {setShowSubmitTask(false)}}
        onOk={() => {
          axios.post('/api/submit', {script: script.current, name: processName.current}).then(resp => { 
            Notification.success({
              title: '提交成功',
              content: resp.data,
              duration: 1,
            })
            setShowSubmitTask(false)
            script.current = ""
            processName.current = ""
            setTick(~tick)
          }).catch(e => {
            Notification.error({
              title: '执行失败',
              content: e,
              duration: 1,
            })
          })
        }}
      >
        <Input onChange={(v) => processName.current = v} style={{marginBottom: '10px'}} placeholder={"process name"} />
        <TextArea autosize={{ minRows: 10, maxRows: 20}} onChange={(v) => script.current = v} />
      </Modal>
          
      
      <Header className="header">
        <div className="capital">
          Software-Defined Operating System
        </div>
        <Button className="next-tick-button" type="primary" theme='solid' onClick={() => {
          axios.get('/api/tick').then(resp => {
            console.log(resp.data);
            Notification.info({
              title: '执行结果',
              content: resp.data,
              duration: 5,
            })
            setTick(!tick);
          })
          setTick(!tick);
        }}> 
          Next Tick
        </Button>
        <Button className="submit-task-button" type="primary" theme="solid" onClick={() => setShowSubmitTask(true)}>
          Submit Task
        </Button>
      </Header>
      <Layout className="maincontent">
        <Content className="content">
          <Tabs tabPosition="left" style={{ height: '100%' }}>
            <TabPane
              tab={
                <span>
                  <IconFile />
                  进程列表
                </span>
              }
              itemKey="1"
            >
              <Processes tick={tick} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconGlobe />
                  文件系统
                </span>
              }
              itemKey="2"
            >
              <FileSystem />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
