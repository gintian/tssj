// 导入自己需要的组件
import {
          Select, Option, OptionGroup, Input,
          Tree, Dialog, Popconfirm ,Row, Col , Table , TableColumn , Pagination ,
          Button,Progress,Autocomplete,Collapse,CollapseItem,
  Checkbox,CheckboxButton,CheckboxGroup,Drawer,
          Radio,RadioGroup,RadioButton,
          Dropdown,Switch,Upload,
          DropdownMenu,
          DropdownItem,
          Notification,
          InputNumber,Message ,
          Form,FormItem,
          DatePicker
        } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select);
    Vue.use(Drawer);
    Vue.use(Option);
    Vue.use(Progress);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
      Vue.use(Switch);
      Vue.use(Upload);
    Vue.use(Autocomplete);
    // Vue.use(Message );
      Vue.component(Message.name, Message)
    Vue.use(OptionGroup);
    Vue.use(Input);
    Vue.use(Tree);
    Vue.use(Dialog);
    Vue.use(Popconfirm );
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Button);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(InputNumber);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(DatePicker);

    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message ;
  }
}

export default element
