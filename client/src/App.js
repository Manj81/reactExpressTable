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

  // Populate Post
  ////////////////////////////////////////// 
  const populatePost = (key, fullName, address) => {
    setUpdateID(key);
    setUpdateFullname(fullName);
    setUpdateAddress(address);
  }

  // Update Post 
  //////////////////////////////////////////
  const updatePost = () => {
    // populate post info from temp state and prepare new object for changed post
    let editedPost = {
      "id": updateID,
      "fullName": updateFullname,
      "address": updateAddress
    }
    // remove old post with same ID and get the remaining data /// filter 
    let filterPost = [...data].filter(OBJ=>OBJ.id!==updateID);
    // prepare object with edited post + remaining data from object above
    let posts = [...filterPost, editedPost];
    // push int state
    setData(posts);

    setUpdateID();
    setUpdateFullname();
    setUpdateAddress();

    // update write to json file
    saveJson(posts);

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
  }

  // Bonus Section
  //////////////////////////////////////////
  // Downloading JSON File
  const saveData = jsonDate => {
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

      <div>
        <h4>Add New Post</h4>
          <form>
          <input placeholder="Fullname" 
            onChange={ e => setFullname( e.target.value ) } 
            value={ fullName || '' } 
            ref={ fullNameRef }
          />
          
          <input 
            placeholder="Address"
            onChange={ e => setAddress( e.target.value ) } 
            value={ address || '' } 
            ref={ addressRef }
          />
          
          <button onClick={ addPost }>Add Post</button>
       </form>
      </div>

      

      { updateFullname || updateAddress ? 
        (
          <div>
            <h4>Update Post</h4>
            <input placeholder="Fullname" 
              onChange={ e => setUpdateFullname( e.target.value ) } 
              value={ updateFullname } 
            />
            
            <input
              placeholder="Address"
              onChange={ e => setUpdateAddress( e.target.value ) } 
               value={ updateAddress } 
            />
            
            <button onClick={ updatePost }>Save</button>
          </div>
        ) : null }

      <div className="posts">
        { data ? data.map(post => {
          return(
            <div key={ post.id } className="post">
              
              <input value= { post.fullName }/>
              <input value= { post.address }/>
              <button onClick={ () => populatePost(post.id, post.fullName, post.address) }>Edit</button>
              <button onClick={ () => deletePost(post.id) }>Delete</button>
              
            </div>
          )
        }) : null }
        <div className="btn-download">
          <button onClick={ e => saveData(data) }>Download Data</button>
        </div>
      </div>
    </div>
  );
}

export default App;