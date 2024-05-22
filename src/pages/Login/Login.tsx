import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button, Input } from "components";
import { useForm } from "@mantine/form";
import { Container } from "@mantine/core";
import QR from "assets/images/qr.png";
import { ReactComponent as FileIcon } from "assets/images/icons/file.svg";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: null,
    password: null,
  });
  const form = useForm({
    initialValues: { phone_number: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      password: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      phone_number: (value) =>
        /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
          ? null
          : "Invalid phone number",
      //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const onSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();
    console.log("lşşl", form.values);
  };

  return (
    <Container size={"xl"}>
      <div className="login">
        <div className="login__box">
          <h3>Вход</h3>
          <div className="login__flex">
            <form onSubmit={onSubmit} className="login__form">
              <div className="login__input">
                <label>Почта</label>
                <Input
                  form={form}
                  type="number"
                  name="phone_number"
                  placeholder="Ваш номер телефона"
                />
              </div>
              <div className="login__input">
                <label>Пароль</label>
                <Input
                  form={form}
                  type="password"
                  name="password"
                  placeholder="password"
                />
              </div>

              <div className="login__form-flex">
                <Button disabled={loading} type="submit" className="btn">
                  {loading ? "Ждите...." : "Войти"}
                </Button>
                <Button type="button">Зарегистрироваться</Button>
              </div>
            </form>
            <div className="border"></div>
            <div className="login__qr">
              <p>
                Или отсканируйте код <br />
                для входа
              </p>
              <div className="qr">
                <img src={QR} alt="" />
              </div>
              <Button type="button">
                Скопировать код <FileIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
}

export default Login;
