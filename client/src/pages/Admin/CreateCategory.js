import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Modal } from "antd";
import CategoryForm from "../../components/Form/CategoryForm";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Handle form submission for creating a new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://ecommerce-apps.onrender.com/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} created successfully`);
        getAllCategory(); // Refresh categories after creation
        setName(""); // Clear input field
      } else {
        toast.error(data?.message || "Failed to create category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating category");
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("https://ecommerce-apps.onrender.com/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category || []);
      } else {
        toast.error(data?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory(); // Fetch categories on component mount
  }, []);

  // Handle category update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://ecommerce-apps.onrender.com/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} updated successfully`);
        setVisible(false); // Close modal after update
        setUpdatedName(""); // Clear updated name state
        setSelected(null); // Clear selected category
        getAllCategory(); // Refresh categories after update
      } else {
        toast.error(data?.message || "Failed to update category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating category");
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    try {
      const { data } = await axios.delete(
        `https://ecommerce-apps.onrender.com/api/v1/category/delete-category/${categoryId}`
      );
      if (data?.success) {
        toast.success(`Category deleted successfully`);
        getAllCategory(); // Refresh categories after deletion
      } else {
        toast.error(data?.message || "Failed to delete category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting category");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Categories</h1>
            <div className="p-3 w-50">
              {/* Category creation form */}
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
                buttonText="Create Category"
              />
            </div>
            <div className="w-75">
              {/* Display list of categories */}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        {/* Edit button */}
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        {/* Delete button */}
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal for editing category */}
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
                buttonText="Update Category"
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
