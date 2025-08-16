class Api::V1::DocumentsController < ApplicationController
  MAX_FILE_SIZE = 1.gigabyte

  before_action :authenticate_user!
  before_action :load_document!, only: %i[destroy share]

  def index
    documents = current_user.documents.order(created_at: :desc).map do |doc|
      {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        content_type: doc.content_type,
        byte_size: doc.byte_size,
        compressed: doc.compressed,
        created_at: doc.created_at,
        public_url: public_document_url(doc.public_token)
      }
    end
    
    render json: { documents: }
  end

  def create
    unless params[:file].present?
      return render json: { error: "File is required!" }, status: :unprocessable_entity
    end
  
    uploaded_file = params[:file]
    return render json: { error: "File too large. Maximum allowed size is 1GB." }, status: :unprocessable_entity if uploaded_file.size > MAX_FILE_SIZE
  
    title = params[:title].presence || uploaded_file.original_filename
    description = params[:description].to_s
    detected_type = Marcel::MimeType.for uploaded_file, name: uploaded_file.original_filename
  
    doc = current_user.documents.build(title:, description:, content_type: detected_type)
  
    file_info = FileCompressor.compress_if_needed(uploaded_file, detected_type)
  
    doc.file.attach(io: file_info[:io], filename: file_info[:filename], content_type: file_info[:content_type])
    doc.byte_size = doc.file.blob.byte_size
    doc.compressed = file_info[:compressed]
  
    if doc.save
      render json: { document: doc.as_json.merge(public_url: public_document_url(doc.public_token)) }, status: :created
    else
      render json: { errors: doc.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @document.destroy!

    head :no_content
  end

  def share
    @document.update!(public_token: SecureRandom.urlsafe_base64(10))

    render json: { public_url: public_document_url(@document.public_token) }
  end

  private

  def load_document!
    @document = current_user.documents.find(params[:id])
  end
end
