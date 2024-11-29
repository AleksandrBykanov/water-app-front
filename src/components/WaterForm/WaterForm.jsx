import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import css from "./WaterForm.module.css";
import { modalTypes } from "../../redux/modal/slice/";


// Валідаційна схема
const schema = yup.object({
  date: yup
    .string()
    .required("Time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  value: yup
    .number()
    .required("Value is required")
    .min(10, "Minimum value is 10ml")
    .max(5000, "Maximum value is 5000ml")
    .typeError("Value must be a number/ value in ml"),
});

export const WaterForm = ({ type, data, onSubmit }) => {
  const initialValues = {
    date: data?.date || new Date().toTimeString().slice(0, 5), // Поточний час
    value: data?.value || 50, // Значення за замовчуванням
  }; 
  
  useEffect(() => {
    if (type === modalTypes.editWater) {
      const valueToCheck = data?.value || 50; // Очікуване значення
      console.log(`Initial value in span (Edit mode): ${valueToCheck} ml`);

      // Додаткова перевірка через assert
      console.assert(
        valueToCheck >= 10 && valueToCheck <= 5000,
        `Invalid value: ${valueToCheck}. Expected between 10 and 5000 ml.`
      );
    }
  }, [type, data]);



  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className={css.formWaterWrapper}>
          {/* Заголовок залежно від типу модалки */}
          {type !== null && (
            <p className={css.secWaterTitle}>
              {(type === modalTypes.addWater && "Choose a value:") ||
                (type === modalTypes.editWater && "Correct entered data:")}
            </p>
          )}

          <div className={css.counterWrapper}>
            <span className={css.amountWaterTitle}>Amount of water:</span>
            <div className={css.counterWaterWrapper}>
              <button
                type="button"
                onClick={() =>
                  setFieldValue("value", Math.max(values.value - 10, 10))
                }
                className={css.counterButton}
              >
                -
              </button>
              <span className={css.counterValue}>{values.value} ml</span>
              <button
                type="button"
                onClick={() =>
                  setFieldValue("value", Math.min(values.value + 10, 5000))
                }
                className={css.counterButton}
              >
                +
              </button>
            </div>
          </div>

          <div className={css.fieldsWaterWrapper}>
            <label className={css.timeLabel} htmlFor="date">
              Recording time:
              <ErrorMessage
                name="date"
                component="span"
                className={css.errorMessage}
              />
            </label>
            <Field className={css.input} type="time" id="date" name="date" />

            <label className={css.valueLabel} htmlFor="value">
              Enter the value of the water used:
              <ErrorMessage
                name="value"
                component="span"
                className={css.errorMessage}
              />
            </label>
            <Field
              className={css.input}
              type="number"
              id="value"
              name="value"
            />
          </div>

          <button className={css.submitButton} type="submit">
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default WaterForm;
