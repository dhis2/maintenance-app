import React, { PropTypes, Component } from "react";
import FontIcon from "material-ui/FontIcon";
import Button from "material-ui/FlatButton";

const style = {
    containerStyle: {
        margin: "0 auto 0 auto",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        alignItems: "center"
    },
    iconStyle: {
        color: "rgb(117, 117, 117)",
        fontSize: "56px"
    },
    retryButtonStyle: {},
    errorTextStyle: {
        color: "rgb(117, 117, 117)"
    }
};
export const Error = props =>
    <div
        style={{ ...style.containerStyle, ...props.style }}
    >
        <FontIcon style={style.iconStyle} className="material-icons">
            error
        </FontIcon>
        <p style={style.errorTextStyle}>
            {props.message}
        </p>
        {props.retry
            ? <Button
                  onClick={props.retry}
                  style={style.retryButtonStyle}
                  label="Retry"
              />
            : null}
    </div>;

Error.propTypes = {
    style: PropTypes.object,
    message: PropTypes.string,
    retry: PropTypes.func
};

Error.defaultProps = {
    message: ""
};

export default Error;