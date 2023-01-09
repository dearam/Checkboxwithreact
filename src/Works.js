import {React,useState} from 'react'
import styled from 'styled-components';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import data from "./nandhu.json";
import date from "./date.json";


const INITIAL_LIST = Array.from({ length: 10 }, () => false);
const COUNT_LIST = Array.from({ length: 10 }, () => 0);

const outcategory=[];
  data.map((node)=>{
    if(!outcategory.includes(node.diagnosis_category)){
      outcategory.push(node.diagnosis_category)
      outcategory.push([node.diagnosis_tags,[node.name]]);
    }
    else{
      const index=outcategory.indexOf(node.diagnosis_category);
      if(!outcategory[index+1].includes(node.diagnosis_tags)){
        outcategory[index+1].push(node.diagnosis_tags,[node.name]);
      }
      else{
        const itag=outcategory[index+1].indexOf(node.diagnosis_tags)+1;
        outcategory[index+1][itag].push(node.name);
      }
    }
  })
const CATEGORY_LIST =[]
  for(let i=0;i<outcategory.length;i++){
    if(i%2==1){
      const temp=[]
      for(let j=0;j<outcategory[i].length/2;j++){
        temp.push(false)
        temp.push(0)
      }
      CATEGORY_LIST.push(temp)
    }else{
      CATEGORY_LIST.push(false)
    }
  }

function Works() {

  const [userinfo, setUserInfo] = useState({
    gettingdatas: [],
    response: [],
  });

  const category=[];
  data.map((node)=>{
    if(!category.includes(node.diagnosis_category)){
      category.push(node.diagnosis_category)
      category.push([node.diagnosis_tags,[node.name]]);
    }
    else{
      const index=category.indexOf(node.diagnosis_category);
      if(!category[index+1].includes(node.diagnosis_tags)){
        category[index+1].push(node.diagnosis_tags,[node.name]);
      }
      else{
        const itag=category[index+1].indexOf(node.diagnosis_tags)+1;
        category[index+1][itag].push(node.name);
      }
    }
  })

  
  const [list, setList] = useState(CATEGORY_LIST)
  const [listdate, setListdate] = useState(INITIAL_LIST)

  const handleOnChange = (e,name,pos1,pos2) => {

    const { checked } = e.target;
    const { gettingdatas} = userinfo;
    const passdata=name;
    if (checked) {
      if(pos2===-1){
        COUNT_LIST[pos1]+=1
      }else{
        CATEGORY_LIST[pos1][pos2]+=1;
      }
      setUserInfo({
        gettingdatas: [...gettingdatas, passdata],
        response: [...gettingdatas, passdata],
      });
    }
    else {
      if(pos2===-1){
        COUNT_LIST[pos1]-=1
      }else{
        CATEGORY_LIST[pos1][pos2]-=1;
      }
      setUserInfo({
        gettingdatas: gettingdatas.filter((e) => e !== passdata),
        response: gettingdatas.filter((e) => e !== passdata),
      });
    }
    if(pos2===-1){
      if(COUNT_LIST[pos1]>0){
        INITIAL_LIST[pos1]=true;
      }else{
        INITIAL_LIST[pos1-1]=false;
      }
    }
    else{
      if(CATEGORY_LIST[pos1][pos2]>0){
        CATEGORY_LIST[pos1-1]=true;
        CATEGORY_LIST[pos1][pos2-1]=true;
      }else{
        CATEGORY_LIST[pos1-1]=false;
        CATEGORY_LIST[pos1][pos2-1]=false;
      }
    }
    console.log(INITIAL_LIST)
  };
  return (
    <Workspage>
        <Left>
          <Card>
            <Header>
              <Title>Select your deseases</Title>
              <Button>Add new selection</Button>
            </Header>
            <Content>
            
                <TreeView
                        key="date"
                        nodeLabel={<><input type="checkbox" checked={INITIAL_LIST[0]}/><span>Last filled prescription</span></>}
                        defaultCollapsed={true}>
                    {date.map((node,i)=>{
                    return(
                      <div>
                          <input
                              type="checkbox"
                              //onChange={()=>handleOnChange(i,input2)}
                              onChange={(e)=>handleOnChange(e,node.date,0,-1)}
                          />{node.date}<br/>
                      </div>
                    )
                  })}
                  </TreeView>
                {
                  category.map((node,i)=>{
                    if(i%2==0){
                      const clabel=<><input type="checkbox" checked={CATEGORY_LIST[i]}/><span>{node}</span></>
                      return(
                        <TreeView
                          nodeLabel={clabel}
                          defaultCollapsed={true}
                        >
                        {
                          category[i+1].map((tnode,j)=>{
                            if(j%2==0){
                              const tlabel=<><input type="checkbox" checked={CATEGORY_LIST[i+1][j]}/><span>{tnode}</span></>
                              return(
                                <TreeView
                                  nodeLabel={tlabel}
                                  defaultCollapsed={true}
                                >{
                                  category[i+1][j+1].map((name)=>{
                                    return(
                                      <>
                                      <input 
                                        type="checkbox"
                                        onChange={(e)=>handleOnChange(e,name,i+1,j+1)}
                                        />{name}<br/>
                                      </>
                                    )
                                  })
                                }
                                </TreeView>
                              )
                            }
                          })
                        }
                        </TreeView>
                      )
                    }
                  })
                }
                  
            </Content>
          </Card>
        </Left>
        <Right>
          <RCard>
          <Head>
              <Title>Select your deseases</Title>
              <RButton>Proceed with {userinfo.response.length}</RButton>
            </Head>
            <Line/>
            <RContent>
            {userinfo.response.map((rnode)=>{
                return(
                  <p>{rnode}</p>
                )
              })}
            </RContent>
          </RCard>
        </Right>
    </Workspage>
  )
}
const Line=styled.div`
  background-color: #999;
  height: 2px;
  width: 100%;
`;
const RContent=styled.div`
    height: 100%;
    width: 100%;
    word-spacing: 0%;
    margin: 30px 0px 30px 20px;
    line-height: 5px;
    color: #333;
    font-family: poppins;
    font-size: 14px;
    font-weight: 400;
    left: 10px;
    background-color: #fff;
`;
const RButton=styled.div`
  border: 2px solid #05aa6c;
  border-radius: 10px;
  background-color: #05aa6c;
  color: #fff;
  right: 10px;
  top: 15px;
  position: absolute;
  font-family: poppins;
  font-weight: 500;
  padding: 5px 10px 5px 10px;
  &:hover{
    background-color: #fff;
    color: #05aa6c;
  }
`;
const Elements=styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
const Content=styled.div`
    left: 20px;
    position: relative;
    height: 250vh;
    width: 100%;
`;
const Head=styled.div`
  height: 70px;
  border-radius: 10px 10px 0px 0px;
  width: 100%;
  background-color: #fff;
`;
const Header=styled.div`
  height: 4%;
  width: 100%;
  background-color: #fff;
  border-radius: 10px 0px 10px 0px;
`;
const Title=styled.div`
  font-family: poppins;
  font-weight: 500;
  position: relative;
  left: 10px;
  top: 20px;
`;
const Button=styled.button`
  border: 2px solid green;
  border-radius: 10px;
  background-color: none;
  color: green;
  right: 10px;
  top: 15px;
  position: absolute;
  font-family: poppins;
  font-weight: 500;
  padding: 5px 10px 5px 10px;
  &:hover{
    background-color: green;
    color: #fff;
  }
`;
const RCard=styled.div`
  top: 50px;
  border-radius: 5px;
  background-color: #fff;
  left: 10%;
  position: relative;
  height: 100%;
  width: 70%;
  overflow: hidden;
`;
const Card=styled.div`
  top: 50px;
  border:2px solid #333;
  border-radius: 10px;
  background-color: #fff;
  left: 10%;
  position: relative;
  height: 250vh;
  width: 70%;
`;
const Left=styled.div`
  flex: 1;
`;
const Right=styled.div`
  height: 100%;
  flex: 1;
`;
const Workspage=styled.div`
    position: relative;
    background-color: #999;
    width: 95%;
    height: 100%;
    left: 5%;
    display: flex;
`;

export default Works