Object.prototype.reduce = function( reduceCallback, initialValue ) {
    let obj = this, keys = Object.keys( obj );

    return keys.reduce( function( prevVal, item, idx, arr ) {
        return reduceCallback( prevVal, item, obj[item], obj );
    }, initialValue );
};

export default class DulView{
  constructor(tag = "div", init_func = ()=>{}){

      this.tag = tag;
      this.style = {};
      this.children = [];
      this.attrs = {};
      this.hooks = [];
      this.view = this.view.bind(this);
      this.render = this.render.bind(this);
      console.log(this);
      init_func.call(this);

  }

  view( init_func = ()=>{} ){
      let template = new DulView("div", init_func);
      this.children.push(template)
  }

  render(){
      let style_repr = this.style.reduce( ( acc, key, val )=>{
          return acc + `${key}="${val}";`
      }, "" );
      let child_repr = this.children.reduce ( (acc, child)=> acc + child.render() );
      let attr_rpr = this.attrs.reduce( (acc, key, val)=>acc +  ` ${key}="${val}"`, "");
      return `<${this.tag} style="${style_repr}" ${attr_rpr}>${this.text || ""}${child_repr}</${this.tag}>`;
  }

}
