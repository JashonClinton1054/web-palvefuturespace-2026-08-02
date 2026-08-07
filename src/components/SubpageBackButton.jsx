import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  margin: 0 0 34px;
  border: 1px solid rgba(239, 214, 162, 0.24);
  border-radius: 4px;
  padding: 0 14px;
  color: rgba(255, 247, 232, 0.7);
  background: rgba(255, 255, 255, 0.025);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  letter-spacing: 0.06em;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;

  span {
    color: #efd6a2;
    font-size: 16px;
    line-height: 1;
  }

  &:hover {
    color: #fff7e8;
    border-color: rgba(239, 214, 162, 0.64);
    background: rgba(239, 214, 162, 0.07);
    transform: translateX(-2px);
  }
`;

export default function SubpageBackButton({ fallback = "/", label = "返回上一级", className }) {
  const navigate = useNavigate();

  const goBack = () => {
    const routerIndex = window.history.state?.idx;
    if (typeof routerIndex === "number" && routerIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <Button
      type="button"
      className={className}
      onClick={goBack}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, duration: 0.35 }}
    >
      <span aria-hidden="true">←</span>
      {label}
    </Button>
  );
}

