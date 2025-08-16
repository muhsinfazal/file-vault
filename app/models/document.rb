class Document < ApplicationRecord
  belongs_to :user
  has_one_attached :file

  validate :file_presence

  before_create :ensure_public_token

  private

  def ensure_public_token
    self.public_token ||= SecureRandom.urlsafe_base64(10)
  end

  def file_presence
    errors.add(:file, "must be attached") unless file.attached?
  end
end
