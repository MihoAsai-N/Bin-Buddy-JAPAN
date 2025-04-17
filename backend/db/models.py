from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

# Waste Items
class WasteItem(Base):
    __tablename__ = "waste_item_with_id"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("sorting_numbers.id"), nullable=False)

    category = relationship("SortingNumber", back_populates="items")


# Sorting Numbers
class SortingNumber(Base):
    __tablename__ = "sorting_numbers"
    id = Column(Integer, primary_key=True )
    categories = Column(String, nullable=False)

    items = relationship("WasteItem", back_populates="category")
    translations = relationship("SortingTranslation", back_populates="sorting")
    area_sortings = relationship("AreaSorting", back_populates="sorting")


# Sorting Translations
class SortingTranslation(Base):
    __tablename__ = "sorting_translations"
    id = Column(Integer, primary_key=True)
    sorting_id = Column(Integer, ForeignKey("sorting_numbers.id"), nullable=False)
    jp = Column(String)
    en = Column(String)
    zh = Column(String)

    sorting = relationship("SortingNumber", back_populates="translations")


# Sapporo City Area
class CityArea(Base):
    __tablename__ = "sapporo_city_area"
    id = Column(Integer, primary_key=True)
    area = Column(String, nullable=False)
    area_id = Column(Integer)
    ward_id = Column(Integer)

    zipcodes = relationship("AreaZipcodeHigashi", back_populates="city_area")
    # area_sortings = relationship("AreaSorting", back_populates="area_rel")


# Area Zipcode (Higashi-ku)
class AreaZipcodeHigashi(Base):
    __tablename__ = "area_address_with_zipcode"
    id = Column(Integer, primary_key=True)
    area = Column(String)
    area_id = Column(Integer, ForeignKey("sapporo_city_area.id"))
    area_en = Column(String)
    postalcode = Column(String)

    city_area = relationship("CityArea", back_populates="zipcodes")


# Address Translations
class AddressTranslation(Base):
    __tablename__ = "address_translation"
    id = Column(Integer, primary_key=True)
    jp = Column(String)
    en = Column(String)


# Area Sorting
class AreaSorting(Base):
    __tablename__ = "area_sorting"

    id = Column(Integer, primary_key=True)

    # 表示用や検索用に使う文字列（市区名とか）
    area = Column(String, nullable=True)  # 明示的に追加

    sorting_id = Column(Integer, ForeignKey("sorting_numbers.id"))

    sorting = relationship("SortingNumber", back_populates="area_sortings")
    # area_rel = relationship("CityArea", back_populates="area_sortings")

# AdminInfo
class AdminInfo(Base):
    __tablename__ = "admin_info"

    id = Column(Integer, primary_key=True)
    municipality_code = Column(String)
    municipality_name = Column(String)
    furigana = Column(String)
    postal_code = Column(String)
    address = Column(String)
    department = Column(String)
    contact_person = Column(String)
    phone_number = Column(String)
    email = Column(String)
    last_login = Column(DateTime) 
    payment_status = Column(String)
    note = Column(String, nullable= True)

