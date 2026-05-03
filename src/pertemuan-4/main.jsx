import { createRoot } from "react-dom/client";  
import './tailwind.css';
import FrameworkListSearchFilter from "./FrameworkListSearchFilter";
import ResponsiveDesign from "./ResponsiveDesign";

createRoot(document.getElementById("root"))
    .render( 
        <div>
            {/* <FrameworkList/> */}
            {/* <FrameworkListSearchFilter/> */}
            <ResponsiveDesign/>
        </div>
    )