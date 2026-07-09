import { Button } from "react-bootstrap";

const CustomForm = ({ cssClasses, heading, inputFields, submitLabel, onSubmit, errors, children }) => {
    return (
        <>
            <h1 className={cssClasses.heading}>{heading}</h1>
            <div className={cssClasses.mainWrapper}>
                <form className={cssClasses.mainForm} onSubmit={onSubmit}>
                    {inputFields.map((field) => (
                        <input
                            key={field.placeholder}
                            className={cssClasses.formInput} {...field} />
                    ))}
                    {errors}
                    <Button type="submit" className={cssClasses.submitBtn}>{submitLabel}</Button>
                </form>
                {children}
            </div>
        </>
    )
};

export default CustomForm;