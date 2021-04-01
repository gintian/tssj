const numberRules = {

    testNumber(txt){

      return (rule, value, callback) => {
          let reg =  /^\d+$|^\d+\.\d+$/g;
          if (String(value)==='undefined'||String(value)==='') {
              callback(new Error(txt));
          } else if (!reg.test(value)) {
              callback(new Error('请输入数字'));
          } else {
              callback();
          }
      }
    },
    'farDetectDistance': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入探测距离'));
        } else if (!reg.test(value)) {

            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'openingAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        console.log(value)
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入摄像头视场角 [单位度]'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'pAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入起始水平角度 [单位度]'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'tAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入起始垂直角度 [单位度]'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'high': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入摄像头高度'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'maxAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入跟踪范围上限'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'minAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入跟踪范围下限'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'deltaOmiga': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入相位偏值'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'deltaPAngle': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入方向角偏值'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'deltaT': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入俯仰角偏值'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },
    'deltaTheta': (rule, value, callback) => {
        let reg = /^\d+$|^\d+\.\d+$/g;
        if (String(value)==='undefined'||String(value)==='') {
            callback(new Error('请输入倾角偏值'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入数字'));
        } else {
            callback();
        }
    },

}


export let formRules = {
    name: [
        {required: true, message: '请输入名称', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    station_name: [
        {required: true, message: '请输入名称', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    userName: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    nickName: [
        {required: true, message: '请输入昵称', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    realName: [
        {required: true, message: '请输入真实姓名', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    title: [
        {required: true, message: '请输入标题', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],

    identify: [
        {required: true, message: '请输入身份证号', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    email: [
        {required: true, message: '请输入邮箱', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    telphone: [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    roleId: [
        {required: true, message: '请输入角色', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    orgId: [
        {required: true, message: '请输入所属部门', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    total_length: [
        {required: true, message: '请输入总长度', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    orderby: [
        {required: true, message: '请输入序号', trigger: 'blur'},
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    station: [
        {required: true, message: '请输入编号', trigger: 'blur'}
    ],
    station_id: [
        {required: true, message: '请输入编号', trigger: 'blur'}
    ],
    plainPassword: [
        {required: true, message: '请输入密码', trigger: 'blur'}
    ],
    lon: [
        {required: true, validator: numberRules.testNumber('请输入经度'), trigger: 'blur'}
    ],
    lat: [
        {required: true, validator: numberRules.testNumber('请输入纬度'), trigger: 'blur'}
    ],
    farDetectDistance: [
        {required: true, validator: numberRules.testNumber('请输入探测距离'), trigger: 'blur'}
    ],
    scope: [
        {required: true, validator: numberRules.testNumber('请输入探测距离'), trigger: 'blur'}
    ],
    controllerDistance: [
        {required: true, validator: numberRules.testNumber('请输入管控范围（米）'), trigger: 'blur'}
    ],
    urlType: [
        {required: true, message: '请选择所属系统', trigger: 'change'}
    ],
    attributionId: [
        {required: true, message: '请选择所属岛屿', trigger: 'change'}
    ],
    status: [
        {required: true, message: '请选择运行状态', trigger: 'change'}
    ],
    radarId: [
        {required: true, message: '请选择所属雷达', trigger: 'change'}
    ],
    waveType: [
        {required: true, message: '请选择波段', trigger: 'change'}
    ],
    group: [
        {required: true, message: '请选择分组', trigger: 'change'}
    ],
    level: [
        {required: true, message: '请选择海域类型', trigger: 'change'}
    ],
    showed: [
        {required: true, message: '请选择是否隐藏', trigger: 'change'}
    ],
    health: [
        {required: true, message: '请选择健康状况', trigger: 'change'}
    ],
    duty: [
        {required: true, message: '请选择是否是海防执勤码头', trigger: 'change'}
    ],
    used: [
        {required: true, message: '请选择是否使用', trigger: 'change'}
    ],
    high: [
        {required: true, validator: numberRules.high, trigger: 'change'}
    ],
    ip: [
        {required: true, message: '请输入ip地址', trigger: 'blur'}
    ],
    openingAngle: [
        {required: true, validator: numberRules.openingAngle, trigger: 'blur'}
    ],
    deltaOmiga: [
        {required: true, validator: numberRules.deltaOmiga, trigger: 'blur'}
    ],
    deltaPAngle: [
        {required: true, validator: numberRules.deltaPAngle, trigger: 'blur'}
    ],
    deltaT: [
        {required: true, validator: numberRules.deltaT, trigger: 'blur'}
    ],
    deltaTheta: [
        {required: true, validator:  numberRules.testNumber('请输入倾角偏值'), trigger: 'blur'}
    ],
    maxAngle: [
        {required: true, validator:  numberRules.testNumber('请输入跟踪范围上限'), trigger: 'blur'}
    ],
    minAngle: [
        {required: true, validator:  numberRules.testNumber('请输入跟踪范围下限'), trigger: 'blur'}
    ],
    pAngle: [
        {required: true, validator: numberRules.pAngle, trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入登录密码', trigger: 'blur'}
    ],
    port: [
        {required: true, message: '请输入SDK端口', trigger: 'blur'}
    ],
    inPort: [
        {required: true, message: '请输入所属码头', trigger: 'blur'}
    ],
    tAngle: [
        {required: true, validator: numberRules.tAngle, trigger: 'blur'}
    ],
    username: [
        {required: true, message: '请输入登录用户名', trigger: 'blur'}
    ],
    videoUrl: [
        {required: true, message: '请输入视频流RTSP地址', trigger: 'blur'}
    ],
}


