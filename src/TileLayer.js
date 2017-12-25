import { PropTypes } from 'react'
import children from './propTypes/children'
import MapLayer from './MapLayer'
import layerContainer from './propTypes/layerContainer'
import map from './propTypes/map'

export default class TileLayer extends MapLayer {
  static propTypes = {
    children: children,
    getTilesUrl: PropTypes.func,
    tileUrlTemplate: PropTypes.string,
    zIndex: PropTypes.number
  }
  static contextTypes = {
    layerContainer: layerContainer,
    map: map,
    pane: PropTypes.string
  }
  createtileMapElement (props) {
    const layer = new BMap.TileLayer(this.getOptions(props))
    if (props.getTilesUrl) {
      layer.getTilesUrl = props.getTilesUrl
    }
    return layer
  }
  componentDidMount () {
    super.componentDidMount()
    this.getLayerContainer().addTileLayer(this.tileMapElement)
  }
  componentWillUnmount () {
    super.componentWillUnmount()
    this.getLayerContainer().removeTileLayer(this.tileMapElement)
  }

  updatetileMapElement (fromProps, toProps) {
    super.updatetileMapElement(fromProps, toProps)
  }
}
