/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
const Notification = ({ message, success }) => {
  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  } else if (success) {
    return <div style={successStyle}>{message}</div>;
  } else {
    return <div style={errorStyle}>{message}</div>;
  }
};

export default Notification;
