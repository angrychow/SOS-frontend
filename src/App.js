import "./App.css";
import { Layout } from "@douyinfe/semi-ui";
import { Tabs, TabPane, Button, Notification } from "@douyinfe/semi-ui";
import { IconFile, IconGlobe, IconHelpCircle } from "@douyinfe/semi-icons";
import { Processes } from "./pages/Processes";
import { FileSystem } from "./pages/FileSystem";
import { useState } from 'react';
import axios from 'axios';

function App() {
  const { Header, Content } = Layout;
  const [tick, setTick] = useState(false);
  return (
    <Layout style={{ height: "100%" }}>
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
              duration: 10,
            })
            setTick(!tick);
          })
          setTick(!tick);
        }}> 
          Next Tick
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
            <TabPane
              tab={
                <span>
                  <IconHelpCircle />
                  帮助
                </span>
              }
              itemKey="3"
            >
              <div style={{ padding: "0 24px" }}>
                <h3>帮助</h3>
                <p
                  style={{
                    lineHeight: 1.8,
                    color: "var(--semi-color-text-0)",
                    fontWeight: 600,
                  }}
                >
                  Q：有新组件需求、或者现有组件feature不能满足业务需求？
                </p>
                <p
                  style={{ lineHeight: 1.8, color: "var(--semi-color-text-1)" }}
                >
                  右上角问题反馈，提交issue，label选择Feature Request / New
                  Component Request 我们会高优处理这些需求。
                </p>
                <p
                  style={{
                    lineHeight: 1.8,
                    color: "var(--semi-color-text-0)",
                    fontWeight: 600,
                  }}
                >
                  Q：对组件的使用有疑惑？
                </p>
                <p
                  style={{ lineHeight: 1.8, color: "var(--semi-color-text-1)" }}
                >
                  欢迎进我们的客服lark群进行咨询提问。
                </p>
              </div>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
