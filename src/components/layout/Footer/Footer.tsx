import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks";
import { FooterButton } from "./FooterButton";

export const Footer = () => {
  const { isLoggedIn } = useApp();
  const navigate = useNavigate();

  const onClickFooterButton = (basePath: string) => {
    navigate(basePath);        
  };

  return(
    <div 
      className={`
        fixed w-full flex justify-center border-t-slate-300 border-t bg-blue-200 h-20 bottom-0 z-10
        ${isLoggedIn ? "animate-footerSlideIn" : "animate-footerSlideOut"}
      `}
    >
      <div className="pt-1.5 ">
        <FooterButton textContent="ホーム" icon="fa-regular fa-house mx-2.5" onClick={() => onClickFooterButton("/home")}/>
        <FooterButton textContent="買い物" icon="fa-regular fa-cart-shopping mx-2.5" onClick={() => onClickFooterButton("/buy")}/>
        <FooterButton textContent="献立" icon="fa-solid fa-clipboard mx-2.5" onClick={() => onClickFooterButton("/menuPlan")}/>
        <FooterButton textContent="レシピ" icon="fa-regular fa-utensils mx-2.5" onClick={() => onClickFooterButton("/recipe")}/>
        <FooterButton textContent="食材" icon="fa-solid fa-carrot mx-2.5" onClick={() => onClickFooterButton("/ingred")}/>
      </div>
    </div>
  );
};
  