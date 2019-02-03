import { Component, Vue } from 'vue-property-decorator'
import ExcelToolTable from './components/table'
import Fmt2Words from './components/fmt2Words'
import './index.scss'

@Component
export default class Excel2Word extends Vue {
  // a4 210 * 297 => 420 * 594
  //  70 * 99 => 350 * 495
  render () {
    return (
      <div class='excel2Word'>
        <div class='left-wrapper'>
          <Fmt2Words />
        </div>
        <div class='right-wrapper'>
          <ExcelToolTable />
        </div>
      </div>
    )
  }
}
