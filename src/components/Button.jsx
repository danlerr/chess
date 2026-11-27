import classNames from "classnames"

function Button({ children, primary, danger, ...rest }) {
    const classes = classNames(rest.className, "btn", {
        "btn-primary" : primary,
        "btn-danger" : danger,
    })
    return (
        <button {...rest} className={classes}>
            {children}
        </button>
    )
}

export default Button