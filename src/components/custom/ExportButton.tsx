import { mkConfig, generateCsv, download } from 'export-to-csv'
import { Button } from '../ui'

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Array<any>
  filename: string
}

const ExportButton = ({ payload, filename }: IProps) => {
  function handleClickExportButton() {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      useBom: true,
      fieldSeparator: ';',
      filename,
      decimalSeparator: ',',
    })
    const csv = generateCsv(csvConfig)(payload)
    download(csvConfig)(csv)
  }

  return (
    <Button
      type="button"
      variant="solid"
      onClick={() => handleClickExportButton()}
    >
      Exportar
    </Button>
  )
}

export default ExportButton
