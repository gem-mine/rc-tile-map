import { forEach, isUndefined, pick, isEqual } from 'lodash'
import React, { PropTypes } from 'react'

import MapComponent from './MapComponent'
import bounds from './propTypes/bounds'
import children from './propTypes/children'
import point from './propTypes/point'
import layerContainer from './propTypes/layerContainer'
import map from './propTypes/map'
import viewport from './propTypes/viewport'

const Map_Options = [
  'minZoom',
  'maxZoom',
  'mapType',
  'enableHighResolution',
  'enableAutoResize',
  'enableMapClick'
]
export default class Map extends MapComponent {
  static defaultProps = {
    mapType: BMAP_NORMAL_MAP,
    disableDoubleClickZoom: false,
    disableScrollWheelZoom: false,
    center: new BMap.Point(116.404, 39.915),
    zoom: 11
  }
  static propTypes = {
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    mapType: PropTypes.instanceOf(BMap.MapType),
    enableHighResolution: PropTypes.bool,
    enableAutoResize: PropTypes.bool,
    enableMapClick: PropTypes.bool,
    onViewportChange: PropTypes.func,
    disableScrollWheelZoom: PropTypes.bool,
    disableDoubleClickZoom: PropTypes.bool,
    children: children,
    className: PropTypes.string,
    id: PropTypes.string,
    style: PropTypes.object,
    viewport: viewport,
    center: point,
    zoom: PropTypes.number
  }

  static childContextTypes = {
    layerContainer: layerContainer,
    map: map
  }
  container
  _updating = false
  constructor (props, context) {
    super(props, context)
  }

  getChildContext () {
    return {
      layerContainer: this.componentInstance,
      map: this.componentInstance
    }
  }

  createComponentInstance (props) {
    const {
      viewport,
      center,
      zoom,
      disableScrollWheelZoom,
      disableDoubleClickZoom
    } = props
    const mapNow = new BMap.Map(this.container, pick(props, Map_Options))
    mapNow.centerAndZoom(center, zoom)
    if (disableScrollWheelZoom) {
      mapNow.disableScrollWheelZoom()
    } else {
      mapNow.enableScrollWheelZoom(true)
    }
    if (disableDoubleClickZoom) {
      mapNow.disableDoubleClickZoom()
    } else {
      mapNow.enableDoubleClickZoom(true)
    }
    return mapNow
  }

  updateComponentInstance (fromProps, toProps) {
    this._updating = true
    const { center, viewport, maxZoom, minZoom, zoom } = toProps
    if (viewport && !isEqual(viewport, fromProps.viewport)) {
      this.componentInstance.setViewport(viewport)
    } else if (center && !center.equals(fromProps.center)) {
      this.componentInstance.centerAndZoom(center, zoom)
    } else if (typeof zoom === 'number' && zoom !== fromProps.zoom) {
      this.componentInstance.centerAndZoom(center, zoom)
    }
    if (typeof maxZoom === 'number' && maxZoom !== fromProps.maxZoom) {
      this.componentInstance.setMaxZoom(maxZoom)
    }
    if (typeof minZoom === 'number' && minZoom !== fromProps.minZoom) {
      this.componentInstance.setMinZoom(minZoom)
    }
    this._updating = false
  }
  componentDidMount () {
    this.componentInstance = this.createComponentInstance(this.props)
    if (this.props.setComponentInstance) {
      this.props.setComponentInstance(this.componentInstance)
    }
    super.componentDidMount()
    this.forceUpdate() // Re-render now that componentInstance is created
  }

  componentDidUpdate (prevProps) {
    this.updateComponentInstance(prevProps, this.props)
  }

  componentWillUnmount () {
    super.componentWillUnmount()
  }

  bindContainer = container => {
    this.container = container
  }

  render () {
    const map = this.componentInstance
    const children = map ? this.props.children : null

    return (
      <div
        className={this.props.className}
        id={this.props.id}
        ref={this.bindContainer}
        style={this.props.style}
      >
        {children}
      </div>
    )
  }
}