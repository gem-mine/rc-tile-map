import PropTypes from 'prop-types'
import { map, controlAnchor, size } from '../propTypes'
import MapControl from './MapControl'

export default class PanoramaControl extends MapControl {
  static defaultProps = {
    show: true,
    anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
    offset: window.BMap && new window.BMap.Size(0, 0)
  }
  static propTypes = {
    anchor: controlAnchor,
    offset: size,
    show: PropTypes.bool
  }

  static contextTypes = {
    map: map
  }
  createComponentInstance (props) {
    return new window.BMap.PanoramaControl(this.getOptions(props))
  }
}
