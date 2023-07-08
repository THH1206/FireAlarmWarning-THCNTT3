import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Formtable from "./components/Formtable";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    imageURL: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    id:"",
    name: "",
    imageURL: "",
  });
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5555/addRooms",
        formData
      );
      console.log(response.data);

      if (response.data === "Room added successfully") {
        setAddSection(false);
        alert("Room added successfully");
        getFetchData();
        setFormData({
          name: "",
          imageURL: "",
        });
      } else {
        alert("Error adding room");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding room");
    }
  };
  const getFetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5555/getRooms");
      console.log(response.data);
      setDataList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`http://localhost:5555/deleteRooms/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Error deleting room');
        }
        
        const data = await response.json();
        getFetchData();
        alert(data.message);
    } catch (error) {
        console.error("Error deleting room:", error);
        alert("Error deleting room");
    }
};

  const handleUpdate = async (e, id) => {
    e.preventDefault();


    try {
      if (formDataEdit.name === "" || id === "") {
        // Xử lý thông báo lỗi hoặc sẽ không gọi axios.put()
      } else {
      const response = await axios.put("http://localhost:5555/updateRooms/" + id, formDataEdit);
      console.log(response.data)  ;
      if(response.data==="Room updated successfully")
      {
        setEditSection(false);
        alert("Room updated successfully");
        getFetchData();
      } 
      else{
        alert("Error updating room");
      }}
    }catch (error) {
      console.error(error);
      alert("Error updating room");
      // Xử lý lỗi tại đây
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };
  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          Add
        </button>

        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)}
            rest={formData}
          />
        )}
        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>imageURL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el) => {
                  console.log(el);
                  return (
                    <tr key={el.id}>
                      <td>{el.id}</td>
                      <td>{el.name}</td>
                      <td>{el.imageURL}</td>
                      <td>
                        <button className="btn btn-edit" onClick={() => handleEdit(el)}>Edit</button>
                        <button className="btn btn-delete"onClick={() => handleDelete(el.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td style={{ textAlign: "center" }}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
