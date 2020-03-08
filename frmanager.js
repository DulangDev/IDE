import DulView from "../static/duljs.js";

let first_frag = new DulView("div", ()=>{
    this.view( ()=>{
        this.tag = "img";
        this.attrs.src = "static/Group 4.pdf"
    } )
});

document.querySelector(".fragment").innerHTML = first_frag.render();
