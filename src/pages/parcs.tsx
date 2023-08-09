import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataService } from "../services/data-service";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";

const Parcs = () => {
  const [parcs, setParcs] = useState(null);
  const [selectedParc, setSelectedParc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const dataService = new DataService();
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    // validate: (data) => {
    //   let errors = {
    //     name: "",
    //     description: "",
    //   };

    //   if (!data.name) {
    //     errors.name = "Parc name is required.";
    //   }

    //   if (!data.description) {
    //     errors.description = "Parc description is required.";
    //   }

    //   return errors;
    // },
    validate: () => {},
    onSubmit: async (data) => {
      await dataService.createParc(data);
      formik.resetForm();
    },
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onCloseDialog = () => {
    setVisible(false);
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      let data = await dataService.getAllParcs();
      setParcs(data);
      setLoading(false);
    };

    fetchData().catch((error) => {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: `${error}`,
        life: 3000,
      });
    });
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">Users</h5>
        <button onClick={() => setVisible(true)}>
          <i className="pi pi-plus" />
          <span className="ml-2">Add New</span>
        </button>
      </div>
    );
  };

  const doSelectParc = async (data: any) => {
    try {
      let parc = await dataService.getOneParc(data?.id);
      setSelectedParc(parc);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: `${error}`,
        life: 3000,
      });
    }
  };

  const header = renderHeader();
  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <a href={`/users`}>Users</a>
            </li>
            <li>
              <a href={`/bookings`}>Bookings</a>
            </li>
            <li>
              <a href={`/parcs`}>Parcs</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <div>
          <Dialog
            visible={visible}
            style={{ width: "25vw" }}
            onHide={() => onCloseDialog()}
          >
            <div className=" flex justify-content-center">
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-column gap-2 "
                style={{ width: "90%" }}
              >
                <h4 className="mt-0 mb-6">Add New Parc</h4>
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={(e) => {
                      formik.setFieldValue("name", e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("name"),
                    })}
                    style={{ width: "90%" }}
                  />
                  <label htmlFor="name">Name</label>
                </span>
                {getFormErrorMessage("name")}
                <span className="p-float-label">
                  <InputText
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={(e) => {
                      formik.setFieldValue("description", e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("description"),
                    })}
                    style={{ width: "90%" }}
                  />
                  <label htmlFor="description">Description</label>
                </span>
                {getFormErrorMessage("description")}
                <Button type="submit" label="Submit" />
              </form>
            </div>
          </Dialog>
          <DataTable
            value={parcs}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            rowHover
            selectionMode="single"
            selection={selectedParc}
            onSelectionChange={(e) => doSelectParc(e.value)}
            filterDisplay="menu"
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="No parcs found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column field="id" header="Id" style={{ minWidth: "14rem" }} />
            <Column field="name" header="Name" style={{ minWidth: "14rem" }} />
            <Column
              field="description"
              header="Description"
              style={{ minWidth: "14rem" }}
            />
          </DataTable>
        </div>
        {selectedParc ? (
          <>
            <div className="m-10 p-6 border-500 surface-overlay border-3 border-round font-bold m-2 ">
              <h2>Selected Parc Details</h2>
              <p>
                <span>Id: </span>
                <span>{selectedParc?.id}</span>
              </p>
              <p>
                <span>Name: </span>
                <span>{selectedParc?.name}</span>
              </p>
              <p>
                <span>Description: </span>
                <span>{selectedParc?.description}</span>
              </p>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Parcs;
