// 必要なライブラリをインポート
const { PDFDocument } = require('pdf-lib');
const fs = require('fs/promises');
const path = require('path');

// PDFファイルが格納されているフォルダと、出力ファイル名を指定
const inputDir = './input_pdfs';
const outputFile = './merged_document.pdf';

async function mergePdfs() {
  // 出力用の新しいPDFドキュメントを作成
  const mergedPdf = await PDFDocument.create();

  // 入力フォルダ内のファイル一覧を取得
  const pdfFiles = (await fs.readdir(inputDir)).filter(file => file.toLocaleLowerCase().endsWith('.pdf'));

  // ファイル名でソート（任意）
  pdfFiles.sort();

  console.log('以下のファイルをマージします:', pdfFiles);

  // 各PDFファイルを順番に処理
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(inputDir, pdfFile);
    // PDFファイルをバイナリデータとして読み込む
    const pdfBytes = await fs.readFile(pdfPath);
    // 読み込んだPDFをドキュメントとしてロード
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // 全てのページをコピー
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  // マージしたPDFをバイナリデータとして保存
  const mergedPdfBytes = await mergedPdf.save();

  // ファイルとしてディスクに書き出す
  await fs.writeFile(outputFile, mergedPdfBytes);

  console.log(`✅ PDFのマージが完了しました: ${outputFile}`);
}

// スクリプトを実行
mergePdfs().catch(console.error);