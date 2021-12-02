import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Data from "./data.json";
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';

function App() {

  // Reference
  const fullNameRef = useRef();
  const addressRef = useRef();

  // State 
  const [data, setData] = useState(Data);

  // Temp State
  const [fullName, setFullname] = useState();
  const [address, setAddress] = useState();

  const [updateID, setUpdateID] = useState();
  const [updateFullname, setUpdateFullname] = useState();
  const [updateAddress, setUpdateAddress] = useState();

  // Effect
  //////////////////////////////////////////
  useEffect(() => {
    // console.log(data);
    // setDate(Data)
    // clear form fields
    fullNameRef.current.value = null;
    addressRef.current.value = null;
  },[data]);
  


  // Add Post
  //////////////////////////////////////////
  const addPost = () => {
    if(fullName && address) {
      // create new post object
      let newPost = {
        "id": uuidv1(),
        "fullName":fullName,
        "address": address,
      }
      // merge new post with copy of old state
      let posts = [...data, newPost];
      // push new object to state
      setData(posts);
      // clear and content from state
      setFullname();
      setAddress();

      // update write to json file
      saveJson(posts);

   }
  }
  


  // Delete Post 
  //////////////////////////////////////////
  const deletePost = (key) => {
    // filter out post containing that id
    let filterOutPost = [...data].filter(OBJ=>OBJ.id!==key);
    // save the rest in state
    setData(filterOutPost);

    // update write to json file
    saveJson(filterOutPost);

  }

  const onchangeName = (i,name) => {
    data[i]["fullName"]=name;
    let editData = [...data];
    setData(editData);
    setUpdateID();
    setUpdateFullname();
    setUpdateAddress();    
  }

  const onchangeAddress = (i,Add) => {
    data[i]["address"]= Add;
    let editData = [...data];
    setData(editData);
    setUpdateID();
    setUpdateFullname();
    setUpdateAddress();    
  }


  const enableEdit = (e,id) => {
    document.getElementById('Name_'+id).readOnly=false 
    document.getElementById('Add_'+id).readOnly=false 
    document.getElementById('Name_'+id).style.pointerEvents = "visible"
    document.getElementById('Add_'+id).style.pointerEvents = "visible"
    document.getElementById('Name_'+id).style.border = "2px solid blue";
    document.getElementById('Add_'+id).style.border = "2px solid blue";
   console.log(e);   
  }
    

  const CancelChanges = () => {
    window.location.reload();   
  }

  
  // Write to JSON File
  //////////////////////////////////////////
  // this function will receive all uodated state / posts after you add, edit delete post
  const saveJson = (posts) => {
    // api URL // end point from node server / express server
    const url = 'http://localhost:5000/write'
    axios.post(url, posts)
    .then(response => {
      // console.log(response);
    });
    window.location.reload();
  }

  // Bonus Section
  //////////////////////////////////////////
  // Downloading JSON File
  const downLoadData = jsonDate => {
    const fileData = JSON.stringify(jsonDate);

    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    // create link
    const link = document.createElement('a');
    // point link to file to be downloaded
    link.download = 'newData.json';
    link.href = url;
    // trigger download
    link.click();
  }




  return (
    <div className="App">

      <div id= "addpost">
        <h4>Add New Post</h4>
          
          <input 
           type = "text" 
           placeholder = "FullName"
           
           onChange={ e => setFullname( e.target.value ) } 
           value={ fullName || '' } 
            ref={ fullNameRef }
          />
          
          <input 
            type = "text"
            placeholder = "Address"
            onChange={ e => setAddress( e.target.value ) } 
            value={ address || '' } 
            ref={ addressRef }
          />
          
          <button onClick={ addPost }>Add Post</button>
      
      </div>

      

      <div className="posts">
        { data ? data.map((post,i) => {
          return(
            <div key={ post.id } className="post">              
              <input  id = {"Name_" + post.id }  value= { post.fullName } onChange={(e) =>onchangeName(i, e.target.value)}readOnly />
              <input  id = {"Add_" + post.id }  value= { post.address } onChange={(e) =>onchangeAddress(i, e.target.value)}readOnly/>
              <button onClick={ (e) => enableEdit(e,post.id) } >Edit</button>
              <button onClick={ () => deletePost(post.id) } >Delete</button>              
            </div>
          )
        }) : null }
        <div className="btn-download">
         <table>
           <tr>
             <td><button onClick={ e => saveJson(data) } className="button" >Save Data</button> </td>
             <td><button onClick={ e => CancelChanges(data) } >Cancel</button> </td>
             <rd> <button onClick={ e => downLoadData(data) }>Download Data</button></rd>
           </tr>
         </table>           
        </div>       
      </div>
    </div>
  );
}

export default App;