export enum ActionKeys {
  INCREMENT_LOADING_COUNTER = 'INCREMENT_LOADING_COUNTER',
  DECREMENT_LOADING_COUNTER = 'DECREMENT_LOADING_COUNTER',
  SET_PAGE_VISIBILITY_HIDDEN = 'SET_PAGE_VISIBILITY_HIDDEN',
  SET_PAGE_VISIBILITY_VISIBLE = 'SET_PAGE_VISIBILITY_VISIBLE',

  GRAPH_CHANGED = 'GRAPH_CHANGED',
  GRAPH_SET_LAYOUT = 'GRAPH_SET_LAYOUT',
  GRAPH_SET_NODE = 'GRAPH_SET_NODE',
  UPDATE_GRAPH = 'UPDATE_GRAPH',
  UPDATE_SUMMARY = 'UPDATE_SUMMARY',
  GET_GRAPH_DATA_START = 'GET_GRAPH_DATA_START',
  GET_GRAPH_DATA_SUCCESS = 'GET_GRAPH_DATA_SUCCESS',
  GET_GRAPH_DATA_FAILURE = 'GET_GRAPH_DATA_FAILURE',
  HANDLE_LEGEND = 'HANDLE_LEGEND',
  GET_GRAPH_DATA_WITHOUT_NAMESPACES = 'GET_GRAPH_DATA_WITHOUT_NAMESPACES',

  GRAPH_TOOLBAR_SET_EDGE_LABEL_MODE = 'GRAPH_TOOLBAR_SET_EDGE_LABEL_MODE',
  GRAPH_TOOLBAR_SET_FIND_VALUE = 'GRAPH_TOOLBAR_SET_FIND_VALUE',
  GRAPH_TOOLBAR_SET_GRAPH_TYPE = 'GRAPH_TOOLBAR_SET_GRAPH_TYPE',
  GRAPH_TOOLBAR_SET_HIDE_VALUE = 'GRAPH_TOOLBAR_SET_HIDE_VALUE',
  GRAPH_TOOLBAR_SET_SHOW_UNUSED_NODES = 'GRAPH_TOOLBAR_SET_SHOW_UNUSED_NODES',
  // Toggle Actions
  GRAPH_TOOLBAR_TOGGLE_COMPRESS_ON_HIDE = 'GRAPH_TOOLBAR_TOGGLE_COMPRESS_ON_HIDE',
  GRAPH_TOOLBAR_TOGGLE_GRAPH_NODE_LABEL = 'GRAPH_TOOLBAR_TOGGLE_GRAPH_NODE_LABEL',
  GRAPH_TOOLBAR_TOGGLE_GRAPH_CIRCUIT_BREAKERS = 'GRAPH_TOOLBAR_TOGGLE_GRAPH_CIRCUIT_BREAKERS',
  GRAPH_TOOLBAR_TOGGLE_GRAPH_VIRTUAL_SERVICES = 'GRAPH_TOOLBAR_TOGGLE_GRAPH_VIRTUAL_SERVICES',
  GRAPH_TOOLBAR_TOGGLE_GRAPH_MISSING_SIDECARS = 'GRAPH_TOOLBAR_TOGGLE_GRAPH_MISSING_SIDECARS',
  GRAPH_TOOLBAR_TOGGLE_GRAPH_SECURITY = 'GRAPH_TOOLBAR_TOGGLE_GRAPH_SECURITY',
  GRAPH_TOOLBAR_TOGGLE_LEGEND = 'GRAPH_TOOLBAR_TOGGLE_LEGEND',
  GRAPH_TOOLBAR_TOGGLE_FIND_HELP = 'GRAPH_TOOLBAR_TOGGLE_FIND_HELP',
  GRAPH_TOOLBAR_TOGGLE_SERVICE_NODES = 'GRAPH_TOOLBAR_TOGGLE_SERVICE_NODES',
  GRAPH_TOOLBAR_TOGGLE_TRAFFIC_ANIMATION = 'GRAPH_TOOLBAR_TOGGLE_TRAFFIC_ANIMATION',
  GRAPH_TOOLBAR_TOGGLE_UNUSED_NODES = 'GRAPH_TOOLBAR_TOGGLE_UNUSED_NODES',
  // Disable Actions
  ENABLE_GRAPH_FILTERS = 'ENABLE_GRAPH_FILTERS',

  HELP_STATUS_REFRESH = 'HELP_STATUS_REFRESH',

  JAEGER_SET_URL = 'JAEGER_SET_URL',
  JAEGER_SET_ENABLED = 'JAEGER_SET_ENABLED',
  JAEGER_SET_INFO = 'JAEGER_SET_INFO',

  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_EXTEND = 'LOGIN_EXTEND',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  MTLS_SET_INFO = 'MTLS_SET_INFO',

  MC_ADD_MESSAGE = 'MC_ADD_MESSAGE',
  MC_REMOVE_MESSAGE = 'MC_REMOVE_MESSAGE',
  MC_MARK_MESSAGE_AS_READ = 'MC_MARK_MESSAGE_AS_READ',
  MC_TOGGLE_MESSAGE_DETAIL = 'MC_TOGGLE_MESSAGE_DETAIL',
  MC_SHOW = 'MC_SHOW',
  MC_HIDE = 'MC_HIDE',
  MC_TOGGLE_EXPAND = 'MC_TOGGLE_EXPAND',
  MC_TOGGLE_GROUP = 'MC_TOGGLE_GROUP',
  MC_HIDE_NOTIFICATION = 'MC_HIDE_NOTIFICATION',
  MC_EXPAND_GROUP = 'MC_EXPAND_GROUP',

  NAMESPACE_REQUEST_STARTED = 'NAMESPACE_REQUEST_STARTED',
  NAMESPACE_SUCCESS = 'NAMESPACE_SUCCESS',
  NAMESPACE_FAILED = 'NAMESPACE_FAILED',
  TOGGLE_ACTIVE_NAMESPACE = 'TOGGLE_ACTIVE_NAMESPACE',
  SET_ACTIVE_NAMESPACES = 'SET_ACTIVE_NAMESPACES',
  NAMESPACE_SET_FILTER = 'NAMESPACE_SET_FILTER',

  NAV_COLLAPSE = 'NAV_COLLAPSE',
  SET_DURATION = 'SET_DURATION',
  SET_LAST_REFRESH = 'SET_LAST_REFRESH',
  SET_REFRESH_INTERVAL = 'SET_REFRESH_INTERVAL',
  SET_REPLAY_WINDOW = 'SET_REPLAY_WINDOW',
  SET_REPLAY_QUERY_TIME = 'SET_REPLAY_QUERY_TIME',
  TOGGLE_REPLAY_ACTIVE = 'TOGGLE_REPLAY_ACTIVE',

  TOUR_END = 'TOUR_END',
  TOUR_SET_STOP = 'TOUR_SET_STOP',
  TOUR_START = 'TOUR_START'
}
