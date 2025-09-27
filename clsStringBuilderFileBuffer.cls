VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "clsStringBuilderFileBuffer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
'==============================================================================
' clsStringBuilderFileBuffer
' ファイルベースのStringBuilderクラス
' 一時ファイルをバッファとして使用し、大容量の文字列操作を可能にする
'==============================================================================

Option Explicit

'--- Private Properties (内部管理) ---
Private m_tempFilePath As String        ' 一時ファイルのパス
Private m_fileHandle As Integer         ' ファイルハンドル
Private m_currentLength As Long         ' 現在の文字数
Private m_currentPosition As Long       ' 現在の書き込み位置
Private m_isFileOpen As Boolean         ' ファイルオープン状態
Private m_encoding As String            ' 文字エンコーディング

'==============================================================================
' Class Events
'==============================================================================

Private Sub Class_Initialize()
    ' 一時ファイルを作成
    Call CreateTempFile
    m_currentLength = 0
    m_currentPosition = 0
    m_encoding = "UTF-8"
End Sub

Private Sub Class_Terminate()
    ' リソースのクリーンアップ
    Call CleanUp
End Sub

'==============================================================================
' Public Properties
'==============================================================================

'--- Length (現在の文字数) ---
Public Property Get Length() As Long
    Length = m_currentLength
End Property

'--- Position (現在の位置) ---
Public Property Get Position() As Long
    Position = m_currentPosition
End Property

'--- IsOpen (ファイルオープン状態) ---
Public Property Get IsOpen() As Boolean
    IsOpen = m_isFileOpen
End Property

'--- IsEmpty (空かどうか) ---
Public Property Get IsEmpty() As Boolean
    IsEmpty = (m_currentLength = 0)
End Property

'--- Text/ToString (全体の文字列を取得) ---
Public Property Get Text() As String
    Text = Me.ToString()
End Property

'--- TempFilePath (一時ファイルパス - デバッグ用) ---
Public Property Get TempFilePath() As String
    TempFilePath = m_tempFilePath
End Property

'--- Encoding (文字エンコーディング) ---
Public Property Get Encoding() As String
    Encoding = m_encoding
End Property

Public Property Let Encoding(ByVal value As String)
    m_encoding = value
End Property

'==============================================================================
' Public Methods
'==============================================================================

'--- Append (文字列を追加) ---
Public Sub Append(ByVal text As String)
    If Not m_isFileOpen Then
        Err.Raise vbObjectError + 1001, "clsStringBuilderFileBuffer", "ファイルが開かれていません"
    End If
    
    On Error GoTo ErrorHandler
    
    ' ファイルに文字列を追加
    Print #m_fileHandle, text;
    
    ' 長さを更新
    m_currentLength = m_currentLength + Len(text)
    m_currentPosition = m_currentPosition + Len(text)
    
    Exit Sub
    
ErrorHandler:
    Err.Raise Err.Number, "clsStringBuilderFileBuffer.Append", Err.Description
End Sub

'--- AppendLine (行を追加) ---
Public Sub AppendLine(Optional ByVal text As String = "")
    Call Me.Append(text & vbCrLf)
End Sub

'--- ToString (全体の文字列を取得) ---
Public Function ToString() As String
    If Not m_isFileOpen Then
        ToString = ""
        Exit Function
    End If
    
    If m_currentLength = 0 Then
        ToString = ""
        Exit Function
    End If
    
    On Error GoTo ErrorHandler
    
    Dim readHandle As Integer
    Dim fileContent As String
    
    ' 現在のファイルを一時的に閉じる
    Close #m_fileHandle
    
    ' 読み取り専用で開く
    readHandle = FreeFile
    Open m_tempFilePath For Input As #readHandle
    
    ' ファイル全体を読み込み
    If LOF(readHandle) > 0 Then
        fileContent = Input$(LOF(readHandle), #readHandle)
    Else
        fileContent = ""
    End If
    
    Close #readHandle
    
    ' 元のファイルを書き込みモードで再度開く
    Open m_tempFilePath For Append As #m_fileHandle
    
    ToString = fileContent
    
    Exit Function
    
ErrorHandler:
    ToString = ""
    Err.Raise Err.Number, "clsStringBuilderFileBuffer.ToString", Err.Description
End Function

'--- Clear (内容をクリア) ---
Public Sub Clear()
    If Not m_isFileOpen Then Exit Sub
    
    On Error GoTo ErrorHandler
    
    ' ファイルを閉じて再作成
    Close #m_fileHandle
    Open m_tempFilePath For Output As #m_fileHandle
    
    m_currentLength = 0
    m_currentPosition = 0
    
    Exit Sub
    
ErrorHandler:
    Err.Raise Err.Number, "clsStringBuilderFileBuffer.Clear", Err.Description
End Sub

'--- Insert (指定位置に文字列を挿入) ---
Public Sub Insert(ByVal index As Long, ByVal text As String)
    ' TODO: 実装が複雑になるため、必要に応じて実装
    Err.Raise vbObjectError + 1002, "clsStringBuilderFileBuffer", "Insert機能は未実装です"
End Sub

'--- Remove (指定範囲の文字列を削除) ---
Public Sub Remove(ByVal startIndex As Long, ByVal length As Long)
    ' TODO: 実装が複雑になるため、必要に応じて実装
    Err.Raise vbObjectError + 1003, "clsStringBuilderFileBuffer", "Remove機能は未実装です"
End Sub

'==============================================================================
' Private Methods
'==============================================================================

'--- CreateTempFile (一時ファイルを作成) ---
Private Sub CreateTempFile()
    On Error GoTo ErrorHandler
    
    ' 一時ファイルパスを生成
    m_tempFilePath = Environ("TEMP") & "\" & "SB_" & Format(Now, "yyyymmdd_hhnnss") & "_" & Int(Rnd * 10000) & ".tmp"
    
    ' ファイルハンドルを取得
    m_fileHandle = FreeFile
    
    ' ファイルを開く（出力モードで作成）
    Open m_tempFilePath For Output As #m_fileHandle
    m_isFileOpen = True
    
    Exit Sub
    
ErrorHandler:
    m_isFileOpen = False
    Err.Raise Err.Number, "clsStringBuilderFileBuffer.CreateTempFile", "一時ファイルの作成に失敗しました: " & Err.Description
End Sub

'--- CleanUp (リソースのクリーンアップ) ---
Private Sub CleanUp()
    On Error Resume Next
    
    ' ファイルを閉じる
    If m_isFileOpen And m_fileHandle > 0 Then
        Close #m_fileHandle
        m_isFileOpen = False
    End If
    
    ' 一時ファイルを削除
    If m_tempFilePath <> "" Then
        If Dir(m_tempFilePath) <> "" Then
            Kill m_tempFilePath
        End If
        m_tempFilePath = ""
    End If
    
    ' 変数をリセット
    m_fileHandle = 0
    m_currentLength = 0
    m_currentPosition = 0
End Sub