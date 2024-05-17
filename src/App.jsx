import "./App.css";
import { Layout, Select } from "@douyinfe/semi-ui";
import { Tabs, TabPane, Button, Notification, Modal, TextArea, Input } from "@douyinfe/semi-ui";
import { IconBrackets, IconFile, IconGlobe, IconPrint, IconTick } from "@douyinfe/semi-icons";
import { Processes } from "./pages/Processes";
import { FileSystem } from "./pages/FileSystem";
import { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DevicesTable from "./pages/DevicesTable";
import MMUTable from "./pages/MMUTable";
import Logs from "./pages/Logs";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const intervalId = setInterval(tick, delay);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [delay]);
}

function App() {
  const { Header, Content } = Layout;
  const [tick, setTick] = useState(false);
  const [showSubmitTask, setShowSubmitTask] = useState(false);
  const [showDeviceInput, setShowDeviceInput] = useState(false);
  const [script, setScript] = useState("")
  const [timer, setTimer] = useState(false);
  const [logs, setLogs] = useState("")
  const openSumbitWithScript = (script_) => {
    setScript(script_)
    setShowSubmitTask(true)
  }
  const processName = useRef("")
  const processPriority = useRef("HIGH")
  const deviceName = useRef("")
  const deviceMsg = useRef("")
  const nextTick = useCallback(() => {
    axios.get('/api/tick').then(resp => {
      console.log(resp.data);
      Notification.info({
        title: '执行结果',
        content: resp.data,
        duration: 1,
        position: 'bottomRight'
      })
      setLogs(logs + '\n' + resp.data)
      console.log(logs)
      setTick(!tick);
    }).catch(err => {
      console.log(err)
    })
  }, [logs, tick])
  const timerCallback = useCallback(() => {
    if(timer) {
      nextTick()
    }
  }, [timer, nextTick])
  useInterval(timerCallback, 100)
  return (
    <Layout style={{ height: "100%" }}>
      <Modal title="提交任务" visible={showSubmitTask} onCancel={() => {setShowSubmitTask(false)}}
        onOk={() => {
          axios.post('/api/submit', {script: script, name: processName.current, priority: processPriority.current}).then(resp => { 
            Notification.success({
              title: '提交成功',
              content: resp.data,
              duration: 1,
            })
            setShowSubmitTask(false)
            setScript("")
            processName.current = ""
            setTick(~tick)
          }).catch(e => {
            Notification.error({
              title: '执行失败',
              content: 'Submit Failed!',
              duration: 1,
            })
          })
        }}
      >
        <Input onChange={(v) => processName.current = v} style={{marginBottom: '10px'}} placeholder={"process name"} />
        <TextArea autosize={{ minRows: 10, maxRows: 20}} style={{marginBottom: '10px'}} value={script} onChange={(v) => setScript(v)} />
        <Select defaultValue={ processPriority.current } onChange={(v) => { console.log(processPriority.current); processPriority.current = v }}>
          <Select.Option value="HIGH">高优先级</Select.Option>
          <Select.Option value="MEDIUM">中优先级</Select.Option>
          <Select.Option value="LOW">低优先级</Select.Option>
        </Select>
      </Modal>
      <Modal title="设备文件输入" visible={showDeviceInput} onCancel={() => { setShowDeviceInput(false) }}
        onOk={() => {
          axios.post('/api/http_input', { deviceName: deviceName.current, content: deviceMsg.current }).then(resp => { 
            Notification.success({
              title: '提交成功',
              content: resp.data,
              duration: 1,
            })
            deviceName.current = ""
            deviceMsg.current = ""
            setTick(~tick)
          }).catch(e => {
            Notification.error({
              title: '执行失败',
              content: 'Submit Failed!',
              duration: 1,
            })
          })
        }}
      >
        <Input onChange={(v) => deviceName.current = v} style={{marginBottom: '10px'}} placeholder={"device name"} />
        <Input onChange={(v) => deviceMsg.current = v} placeholder={"message"} />
      </Modal>
      
      <Header className="header">
        <div className="capital">
          Software-Defined Operating System
        </div>
        <Button className="next-tick-button" type="primary" theme='solid' onClick={nextTick}> 
          Next Tick
        </Button>
        <Button className="submit-task-button" type="primary" theme="solid" onClick={() => setShowSubmitTask(true)}>
          Submit Task
        </Button>
        <Button className="submit-task-button" type="primary" theme="solid" onClick={() => {
          if(timer) {
            clearInterval(timer)
            setTimer(null)
          } else {
            nextTick()
            setTimer(true)
          }
        }}>
          { timer ? 'Stop'  : 'Continously Run' }
        </Button>
        <Button className="submit-task-button" type="primary" theme="solid" onClick={() => setShowDeviceInput(true)}>
          Device Input
        </Button>
      </Header>
      <Layout className="maincontent">
        <Content className="content">
          <Tabs tabPosition="left" style={{ height: '100%', display: 'flex'}}>
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
              style={{ flexGrow: '3' }}
            >
              <FileSystem tick={tick} show={openSumbitWithScript} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconPrint />
                  设备状态
                </span>
              }
              itemKey="3"
            >
              <DevicesTable tick={tick} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconBrackets tick={tick} />
                  MMU 状态
                </span>
              }
              itemKey="4"
            >
              <MMUTable tick={tick} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconTick />
                  日志
                </span>
              }
              itemKey="5"
            >
              <Logs logs={logs} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
