import { createStore } from 'vuex'
import wsResponse from './ws_response'

export default createStore({
  modules: {
    response:wsResponse
  }
})
