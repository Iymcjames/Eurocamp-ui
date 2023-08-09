import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataService } from "../services/data-service";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React from "react";

const Bookings = () => {
  const [bookings, setBookings] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [date1, setDate1] = useState(null);

  const dataService = new DataService();
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      user: "",
      parc: "",
      bookingdate: "",
      comments: "",
    },
    validate: () => {},
    onSubmit: async (data) => {
      data.bookingdate = (date1 as unknown as Date)?.toDateString();
      await dataService.createBooking(data);
      setDate1(null);
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
      let data = await dataService.getAllBookings();
      setBookings(data);
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

  const doSelectBooking = async (data: any) => {
    try {
      let Booking = await dataService.getOneBooking(data?.id);
      setSelectedBooking(Booking);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: `${error}`,
        life: 3000,
      });
    }
  };

  const dateBodyTemplate = (rowData: any) => {
    return new Date(rowData?.bookingdate).toLocaleString();
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
                <h4 className="mt-0 mb-6">Add New Booking</h4>
                <span className="p-float-label">
                  <InputText
                    id="user"
                    name="user"
                    value={formik.values.user}
                    onChange={(e) => {
                      formik.setFieldValue("user", e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("user"),
                    })}
                    style={{ width: "90%" }}
                  />
                  <label htmlFor="user">User</label>
                </span>
                {getFormErrorMessage("user")}
                <span className="p-float-label">
                  <InputText
                    id="parc"
                    name="parc"
                    value={formik.values.parc}
                    onChange={(e) => {
                      formik.setFieldValue("parc", e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("parc"),
                    })}
                    style={{ width: "90%" }}
                  />
                  <label htmlFor="parc">Parc</label>
                </span>
                {getFormErrorMessage("parc")}
                <span className="p-float-label">
                  <Calendar
                    id="bookingdate"
                    value={date1}
                    style={{ width: "90%" }}
                    onChange={(e) => setDate1(e.value)}
                  />
                  <label htmlFor="bookingdate">Booking Date</label>
                </span>
                {getFormErrorMessage("bookingdate")}
                <span className="p-float-label">
                  <InputText
                    id="comments"
                    name="comments"
                    value={formik.values.comments}
                    onChange={(e) => {
                      formik.setFieldValue("comments", e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("comments"),
                    })}
                    style={{ width: "90%" }}
                  />
                  <label htmlFor="comments">Comments</label>
                </span>
                {getFormErrorMessage("comments")}

                <Button type="submit" label="Submit" />
              </form>
            </div>
          </Dialog>
          <DataTable
            value={bookings}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            rowHover
            selectionMode="single"
            selection={selectedBooking}
            onSelectionChange={(e) => doSelectBooking(e.value)}
            filterDisplay="menu"
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="No Bookings found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column field="id" header="Id" style={{ minWidth: "14rem" }} />
            <Column field="user" header="User" style={{ minWidth: "14rem" }} />
            <Column field="parc" header="Parc" style={{ minWidth: "14rem" }} />
            <Column
              field="bookingdate"
              header="Booking Date"
              body={dateBodyTemplate}
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="comments"
              header="Comments"
              style={{ minWidth: "14rem" }}
            />
          </DataTable>
        </div>
        {selectedBooking ? (
          <>
            <div className="m-10 p-6 border-500 surface-overlay border-3 border-round font-bold m-2 ">
              <h2>Selected Booking Details</h2>
              <p>
                <span>Id: </span>
                <span>{selectedBooking?.id}</span>
              </p>
              <p>
                <span>User: </span>
                <span>{selectedBooking?.user}</span>
              </p>
              <p>
                <span>Parc: </span>
                <span>{selectedBooking?.parc}</span>
              </p>
              <p>
                <span>Booking Date: </span>
                <span>{selectedBooking?.bookingdate}</span>
              </p>
              <p>
                <span>Comments: </span>
                <span>{selectedBooking?.comments}</span>
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

export default Bookings;
