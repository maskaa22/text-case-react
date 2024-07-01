import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginFormProps } from "../../interface";
import styled from "styled-components";

const FormContainer = styled.div`
  .form-control {
    width: 400px;
    border: 2px solid #bee3f8;
    margin: 100px auto;
    border-radius: 5px;
  }
`;
const FormInputLabel = styled(FormLabel)`
  margin-top: 20px;
  margin-left: 40px;
`;
const FormInput = styled(Input)`
  width: 80%;
  margin: 10px 40px;
`;

const SubmitButton = styled(Button)`
  margin: 40px 120px;
  width: 40%;
`;

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormProps> = async (data) => {
    try {
      const response = await axios.post<{ token: string }>(
        "http://localhost:3000/login",
        data
      );
      const { token } = response.data;

      localStorage.setItem("token", token);
      if (token) {
        navigate(`/transaction/${token}`);
      }
    } catch (error) {
      alert("Invalid username or password");
      console.error("Login failed:", error);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl className="form-control">
          <FormInputLabel htmlFor="username">Username</FormInputLabel>
          <FormInput
            {...register("username", { required: true })}
            id="username"
          />
          {errors.username && <span>This field is required</span>}

          <FormInputLabel htmlFor="password">Password</FormInputLabel>
          <FormInput
            {...register("password", { required: true })}
            type="password"
            id="password"
          />
          {errors.password && <span>This field is required</span>}

          <SubmitButton type="submit">Login</SubmitButton>
        </FormControl>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
