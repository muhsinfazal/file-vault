class Document < ApplicationRecord
  belongs_to :user
  has_one_attached :file

  validates :file, attached: true

  before_create :ensure_public_token

  private

  def ensure_public_token
    self.public_token ||= SecureRandom.urlsafe_base64(10)
  end
end
