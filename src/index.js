// 整合state和dispatch的一个包装的封装函数；
// 希望变得通用，所以更新页面的操作抽离成一个观察者模式来实现，自动实现页面更新
function createStore(reducer) {
    let state = null;
    const listeners = [];
    const subscribe = (listener) => listeners.push(listener);
    const getState = () => state
    const dispatch = (action) => {
        // 修改数据，为什么修改数据就会修改原有的state,原因是对象是一个引用对象，可以直接修改内部指向
        state = reducer(action,state); 
        listeners.forEach((item)=>item())
    }
    // 初始化state
    dispatch({}) 
    return {getState,dispatch,subscribe}
}

function renderApp(newState,oldState={}) {
    if(newState == oldState){ return }
    console.log('----renderApp');
    renderTitle(newState.title,oldState.title);
    renderContent(newState.content,oldState.content);
} 

function renderTitle(newTitle, oldTitle = {}) {
    if(newTitle == oldTitle) {return}
    console.log('----renderTitle');
    const titleDOM = document.getElementById('title');
    titleDOM.innerHTML = newTitle.text;
    titleDOM.style.color = newTitle.color;
}

function renderContent(newContent, oldContent = {}) {
    if(newContent == oldContent) {return}
    console.log('----renderContent');
    const titleDOM = document.getElementById('content');
    titleDOM.innerHTML = newContent.text;
    titleDOM.style.color = newContent.color;
}

// 纯函数- 只初始化state和修改state属性，对外部不影响，
function reducer(action,state) {
    if(!state) {
        return {
            title: {
                text: "xx",
                color: "red"
            },
            content: {
                text: "yy",
                color: "green"
            }
        }
    }
    switch(action.type) {
        case "CHANGE_TITLE_TEXT": 
            return {
                ...state,
                title: {
                    ...state.title,
                    text:action.text
                }
            }
        case "CHANGE_TITLE_COLOR":
            return {
                ...state,
                title: {
                    ...state.title,
                    color:action.color
                }
            }
        default:
            return state
    }
}

const store = createStore(reducer)
let oldState = store.getState();
store.subscribe(()=> {
    const newState = store.getState();
    renderApp(newState,oldState);
    oldState = newState;
})
// 首次渲染
renderApp(store.getState())
store.dispatch({type:"CHANGE_TITLE_TEXT",text:'hhhh1'})
store.dispatch({type:"CHANGE_TITLE_COLOR",color:'yellow'})

