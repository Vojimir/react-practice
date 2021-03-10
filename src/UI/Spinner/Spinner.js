import "./Spinner.css";

const spinner = (props) => {
  return props.show ? (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  ) : null;
};

export default spinner;
